# Frontend INFO

이 문서는 CLI 환경에서 AI를 활용하여 Frontend 코드를 구현할 때
공통으로 적용하는 기술 스택, 프로젝트 구조, 컴포넌트 재사용 및 스타일 규칙을 정의한다.

화면별 요구사항은 `Frontend_화면구현.md`를 따른다.

---

# 1. 기술 스택

- Language: JavaScript (ES6+)
- Framework / Library: React (v19)
- Build Tool: Vite
- Routing: React Router DOM
- Styling: Styled-Components, React Icons
- Data Fetching: Axios
- Visualization: Recharts
- Code Quality: ESLint

---

# 2. 참고 문서

Frontend 구현 전 다음 자료를 먼저 확인한다.

1. 현재 프로젝트의 실제 Frontend 코드
2. `컴포넌트_설계_정의서_웰니스_플랫폼_v1.3.0.pdf`
3. 화면 설계 / Figma
4. API 명세

컴포넌트 설계 정의서와 실제 코드가 다를 경우 임의로 공통 구조를 변경하지 않는다.
차이가 구현에 영향을 주는 경우 작업자에게 확인한다.

---

# 3. 기본 프로젝트 구조

```text
src/
├── app/
├── components/
├── features/
├── styles/
└── utils/
```

## components

여러 화면 또는 도메인에서 공통으로 사용하는 UI를 관리한다.

예:

- Button
- Input
- Modal
- Layout
- Badge
- Card
- Pagination
- StarRating

## features

특정 기능 또는 도메인에 종속된 UI와 로직을 관리한다.

예:

```text
features/
├── auth/
├── courses/
├── reviews/
├── map/
└── admin/
```

기능별로 필요한 경우 다음 구조를 사용한다.

```text
features/[domain]/
├── api/
├── components/
├── hooks/
└── utils/
```

---

# 4. 공통 컴포넌트 기준

Frontend 구현 전
`컴포넌트_설계_정의서.pdf`와 현재 프로젝트의 `src/components`를 확인한다.

공통 컴포넌트의 종류, 역할, Props, 스타일 규칙은
컴포넌트 설계 정의서를 기준으로 한다.

---

# 5. 컴포넌트 재사용 규칙

새 컴포넌트를 생성하기 전에 다음 순서로 확인한다.

1. 컴포넌트 설계 정의서에 동일하거나 유사한 역할의 컴포넌트가 있는지 확인한다.
2. 실제 프로젝트의 `src/components`에 해당 컴포넌트가 구현되어 있는지 확인한다.
3. 기존 컴포넌트의 Props 또는 조합으로 구현 가능한지 확인한다.
4. 기존 컴포넌트로 구현할 수 없는 경우에만 신규 컴포넌트 생성을 검토한다.

컴포넌트 설계 정의서와 실제 프로젝트 코드가 다른 경우
실제 코드를 임의로 변경하지 않고 차이점을 작업자에게 알린다.

---

# 6. 스타일 규칙

Frontend 구현 전 현재 프로젝트의 다음 파일을 확인한다.

- `src/styles/theme.js`
- `src/styles/GlobalStyles.js`
- 구현 대상과 관련된 기존 스타일 파일

스타일 구현 시 기존 `theme.js`와 `GlobalStyles.js`의 규칙을 우선 따른다.

기존 theme 값으로 표현 가능한 디자인 값을 임의로 중복 정의하지 않는다.

`theme.js` 또는 `GlobalStyles.js` 수정이 필요한 경우
수정 이유와 영향 범위를 설명하고 작업자에게 수정 여부를 확인한다.

---

# 7. API 규칙

- 현재 프로젝트의 기존 Axios 설정을 먼저 확인한다.
- 공통 Axios 인스턴스가 있으면 재사용한다.
- API 명세의 URL, HTTP Method, Request, Response 구조를 따른다.
- 동일 API 호출 코드를 여러 컴포넌트에 중복 작성하지 않는다.
- 기능별 API 코드는 기존 프로젝트 구조에 맞춰 `features/[domain]/api` 등에 분리한다.
- 제공되지 않은 API 동작을 임의로 추가하지 않는다.

---

# 8. 공통 구현 원칙

- 현재 프로젝트의 실제 구조를 먼저 확인한다.
- 기존 컴포넌트를 우선 재사용한다.
- 화면 설계와 API 명세를 우선한다.
- 요청하지 않은 기능을 임의로 추가하지 않는다.
- 제공되지 않은 사용자 동작을 임의로 추가하지 않는다.
- 관련 없는 파일을 수정하지 않는다.
- 기존 기능을 임의로 삭제하거나 덮어쓰지 않는다.
- 불필요한 공통화와 과도한 컴포넌트 분리를 하지 않는다.
- 하나의 Page가 지나치게 커지는 경우 의미 있는 UI 단위로 분리한다.
