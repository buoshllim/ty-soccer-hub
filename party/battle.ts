import type * as Party from 'partykit/server'

interface Card {
  id: string; name: string; tier: string; pos: string
  atk: number; pas: number; def: number; spd: number; stm: number; total: number
}

type Phase = 'waiting' | 'card_select' | 'picking' | 'done'

interface Slot {
  connId: string; card: Card | null
  usedStats: string[]; pickedStat: string | null; score: number
}

interface RoundResult {
  round: number
  homeStat: string; awayStat: string
  homeVal: number; awayVal: number
  winner: 'home' | 'away' | 'draw'
}

interface State {
  phase: Phase; round: number
  home: Slot | null; away: Slot | null
  rounds: RoundResult[]
  winner: 'home' | 'away' | 'draw' | null
}

function makeSlot(connId: string): Slot {
  return { connId, card: null, usedStats: [], pickedStat: null, score: 0 }
}

export default class BattleServer implements Party.Server {
  private s: State = { phase: 'waiting', round: 1, home: null, away: null, rounds: [], winner: null }
  private homeId: string | null = null
  private awayId: string | null = null

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection) {
    if (!this.homeId) {
      this.homeId = conn.id
      this.s.home = makeSlot(conn.id)
      conn.send(JSON.stringify({ type: 'assigned', role: 'home' }))
    } else if (!this.awayId) {
      this.awayId = conn.id
      this.s.away = makeSlot(conn.id)
      conn.send(JSON.stringify({ type: 'assigned', role: 'away' }))
      this.s.phase = 'card_select'
    } else {
      conn.send(JSON.stringify({ type: 'error', msg: 'Room full' }))
      conn.close()
      return
    }
    this.broadcast()
  }

  onClose(conn: Party.Connection) {
    if (this.homeId === conn.id) this.homeId = null
    if (this.awayId === conn.id) this.awayId = null
    if (this.s.phase !== 'done') {
      this.s = { phase: 'waiting', round: 1, home: null, away: null, rounds: [], winner: null }
      if (this.homeId) this.s.home = makeSlot(this.homeId)
    }
    this.broadcast()
  }

  onMessage(msg: string, sender: Party.Connection) {
    let data: any
    try { data = JSON.parse(msg) } catch { return }

    const role = this.homeId === sender.id ? 'home' : 'away'
    const slot = role === 'home' ? this.s.home : this.s.away
    if (!slot) return

    if (data.type === 'select_card' && this.s.phase === 'card_select') {
      slot.card = data.card
      if (this.s.home?.card && this.s.away?.card) this.s.phase = 'picking'
      this.broadcast()
    }

    if (data.type === 'pick_stat' && this.s.phase === 'picking') {
      const stat: string = data.stat
      if (slot.usedStats.includes(stat) || slot.pickedStat) return
      slot.pickedStat = stat

      const h = this.s.home!, a = this.s.away!
      if (h.pickedStat && a.pickedStat) {
        const hVal = (h.card as any)[h.pickedStat]
        const aVal = (a.card as any)[a.pickedStat]
        let w: 'home' | 'away' | 'draw'
        if (hVal > aVal)      { w = 'home'; h.score++ }
        else if (aVal > hVal) { w = 'away'; a.score++ }
        else                  { w = 'draw'; h.score += 0.5; a.score += 0.5 }

        this.s.rounds.push({ round: this.s.round, homeStat: h.pickedStat, awayStat: a.pickedStat, homeVal: hVal, awayVal: aVal, winner: w })
        h.usedStats.push(h.pickedStat); h.pickedStat = null
        a.usedStats.push(a.pickedStat); a.pickedStat = null

        if (this.s.round >= 5) {
          const ht = h.card!.total, at = a.card!.total
          let tw: 'home' | 'away' | 'draw'
          if (ht > at)      { tw = 'home'; h.score++ }
          else if (at > ht) { tw = 'away'; a.score++ }
          else              { tw = 'draw' }
          this.s.rounds.push({ round: 6, homeStat: 'total', awayStat: 'total', homeVal: ht, awayVal: at, winner: tw })

          if (h.score > a.score)      this.s.winner = 'home'
          else if (a.score > h.score) this.s.winner = 'away'
          else                        this.s.winner = 'draw'
          this.s.phase = 'done'
        } else {
          this.s.round++
        }
        this.broadcast()
      } else {
        this.broadcast()
      }
    }
  }

  private broadcast() {
    this.room.broadcast(JSON.stringify({ type: 'state', state: this.s }))
  }
}
