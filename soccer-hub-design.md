# TY's Soccer Hub — Design System

Claude.com 에디토리얼 디자인 시스템에서 영감을 받아, Soccer Hub에 맞게 조정한 버전.

---

## 원본 레퍼런스: Claude.com Editorial Design System

### 철학

- **Warmth over sterility** — 차갑고 기술적인 느낌 대신 따뜻하고 초대하는 분위기
- **Editorial, not app-like** — 버튼과 위젯보다 타이포그래피와 여백으로 품격을 만든다
- **Honest materials** — 화려한 그라디언트·그림자보다 색상과 폰트 자체의 힘을 믿는다
- **Calm hierarchy** — 한 페이지에 강조점 하나. 시선이 자연스럽게 흐르게

### 원본 색상 팔레트

| 역할 | 값 |
|---|---|
| Canvas (배경) | `#faf9f5` |
| Surface (카드) | `#ffffff` |
| Border | `#e8e5de` |
| Text Primary | `#181715` |
| Text Secondary | `#7a7670` |
| Coral (Primary Accent) | `#cc785c` |
| Coral Dark (hover) | `#b5623a` |

### 원본 타이포그래피

| 역할 | 폰트 | 설명 |
|---|---|---|
| Display / Heading | Copernicus (상용) | 세리프, 에디토리얼 느낌 |
| UI / Body | StyreneB / Inter | 산세리프, 가독성 중심 |

**오픈소스 대체:**
- Copernicus → **Cormorant Garamond** (Google Fonts, 가장 유사한 세리프)
- StyreneB → **Inter** (Google Fonts)

### 원본 스케일 & 간격

- 기본 단위: 4px 그리드
- 섹션 여백: 64px ~ 80px
- 카드 패딩: 28px ~ 36px
- 요소 간격: 24px (gap)
- 모서리: 12px (카드), 24px (pill 버튼)

### 원본 컴포넌트 원칙

- **카드**: 흰 배경 + 얇은 테두리 + 미세한 그림자. 그라디언트 없음
- **버튼**: pill 형태(border-radius 24px), coral 배경, 흰 텍스트. hover에 살짝 scale
- **타이포 대비**: 큰 세리프 제목 + 작은 산세리프 본문. 이 대비 하나로 위계 완성
- **hover**: translateY(-3~4px) + 그림자 강화. 떠오르는 느낌

---

## Soccer Hub 적용 버전

원본 시스템을 그대로 쓰되, "축구 허브"의 밝고 활기찬 성격에 맞게 그대로 유지.

### 색상 (적용값)

| 역할 | 값 |
|---|---|
| 배경 | `#faf9f5` |
| 카드 배경 | `#ffffff` |
| 카드 테두리 | `#e8e5de` |
| 텍스트 (주) | `#181715` |
| 텍스트 (부) | `#7a7670` |
| PLAY 버튼 | `#cc785c` |
| PLAY 버튼 hover | `#b5623a` |

### 폰트 (적용값)

Google Fonts 로드 (index.html `<head>` 안):
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

| 역할 | 폰트 |
|---|---|
| h1, h2 | Cormorant Garamond |
| 본문, 버튼, 부제목 | Inter |

### 타이포그래피 (적용값)

| 요소 | 크기 | 굵기 | 기타 |
|---|---|---|---|
| h1 | 52px | 700 | letter-spacing -0.5px, line-height 1.1 |
| 부제목 | 15px | 400 | color #7a7670, letter-spacing 0.02em |
| 카드 h2 | 22px | 600 | line-height 1.2 |
| 카드 p | 13px | 400 | line-height 1.6, min-height 42px |
| 버튼 | 13px | 600 | letter-spacing 0.04em |

### 레이아웃 (적용값)

- 페이지 패딩: `72px 24px 80px`
- 카드 너비: `260px`
- 카드 패딩: `36px 28px 32px`
- 카드 그리드: flex, wrap, gap 24px, 가운데 정렬
- 페이지 텍스트: 가운데 정렬

### 카드 (적용값)

```
background: #ffffff
border: 1px solid #e8e5de
border-radius: 12px
box-shadow: 0 2px 8px rgba(24,23,21,0.06)
hover: translateY(-3px), box-shadow 0 6px 20px rgba(24,23,21,0.10)
```

### 버튼 (적용값)

```
background: #cc785c
color: #ffffff
padding: 10px 28px
border-radius: 24px
hover: background #b5623a, scale(1.03)
```

---

## 확장 가이드

새 카드·페이지 추가할 때 지켜야 할 것:

1. **팔레트 밖으로 나가지 말 것** — 새 색상 쓰고 싶으면 위 5색 안에서 해결
2. **폰트 추가하지 말 것** — Cormorant Garamond(제목) + Inter(나머지) 두 개로 끝
3. **카드 구조 유지** — 새 게임/앱은 `.card` 하나 추가하면 끝. 레이아웃 손댈 필요 없음
4. **버튼은 항상 coral** — 다른 색 버튼은 쓰지 않는다
5. **그라디언트·애니메이션 자제** — hover 효과는 translateY + shadow/scale 선에서 마무리
