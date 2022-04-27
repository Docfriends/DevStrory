---
layout: post
title: "nuxt에서의 typescript를 활용한 타입 추론 방법"
description: "typescript is not working"
date: 2022-04-20
tags: [Project, vue, vuex, nuxt, typescript]
writer: unseoJang
category: Fronte-end
comments: true
share: true
---
# typescript is not working

typescript는 javascript 와는 다르게 정해져 있는 타입 아래에서만 움직여야 하고 대부분의 오브젝트들의 타입들을 정의해줘야 합니다.
vuex를 사용하면서 해당 패턴들에 관련된 타입정의를 진행하지 않으면 오류가 나는 부분을 확인했고 첫 세팅으로 nuxt.config.js 파일을 ts 파일로 변환하였습니다.

후에 vue를 쭉 살펴보니 vuex 3.6.2 버전에서는 vuex(상태 관리를 위한 패턴이자 라이브러리) 패턴들에 대한 typescript의 타입 추론을 제공해주지 않는 상태였고(store에 대한 타입추론들이 모두 any로 되어있음, 타입추론이 안됨) 이 부분 관련해서 찾아본 두 가지 방법이 있었습니다.

1. 클래스 문법을 활용해 vue-decorator-property 를 설치한 다음 해당 라이브러리에서 제공하는 타입 추론을 이용하는 방법
2. vue.extend 문법을 활용해서 vuex의 패턴들에 대한 타입 추론을 직접 설정하는 방법
   위처럼 제가 찾은 방법은 두 가지가 있었고 첫 번째 방법인 class 컴포넌트를 사용하는 방법도 있었지만 각각의 방법에서는 단점들을 몇 가지 찾을 수 있었습니다.

- vue-decorator-property 사용의 단점

  1. vue 개발자인 에반뉴는 class 컴포넌트의 개발 방향성을 지양하게 되었고 호환은 되지만 더 이상의 업데이트는 없을 것이다.
  2. 해당 라이브러리에 대한 의존성이 높다
  3. Angular 문법과 다를게 없다

- vue.extend 문법의 단점
  1. node-moduel에서 설치된 vuex 타입 추론을 삭제하고 vuex 관련 패턴들에 관한 타입 추론 을 직접 설정을 해야 한다.

저희 팀은 후자를 선택하게 되었습니다. 다른 외부 라이브러리에 관해 의존성이 높은 걸 선호하지 않았기 때문입니다.

vue.extend를 적용하기 위해서 node-moduel에서 자동으로 생성해준 vue.d.ts 파일을 제거하고 직접 d.ts 파일을 생성해서 아래와 같이 적용해주었습니다.

### 1. state에 타입을 씌우기

`store/index.ts`

```ts
import { myRootState } from '@/store/state'
import { memberState } from '@/store/member/memberState'
import { smsState } from '@/store/sms/smsState'

export const state = {
  ...myRootState, ...memberState, ...smsState
}
```

`store/state.ts`
```ts
import { Cookies } from '~/data/enums'

const cookiesObj = {
  [Cookies.accessToken]: '',
  // ...
}

const myRootState = {
  host: '' as string,
  // ...
};

type MyRootState = typeof myRootState;

export { MyRootState, myRootState };


```

이렇게 까지만 하면 타입 추론이 안되고  node-module 에서 vuex의 vue.d.ts 파일을 제거하고 직접 타입 추론 파일을 제작, 설정해야지 타입 추론이 이루어질 수 있습니다.


`store/types.ts`

```ts
// 인터섹션 (합진합) -> &
export type MyStore = Omit<
  Store<MyRootState> &
    Store<SmsState> &
    Store<SendHistoryState> &
    Store<MemberState>,
  "commit" | "dispatch" | "getters"
> &
  MyMutations &
  MySmsMutations &
  MyMemberMutations &
  MySendHistoryMutations &
  MyActions &
  MySmsActions &
  MyMemberActions &
  MySendHistoryActions &
  MyGetters;
```

해당 파일에서 vuex의 재정의를 Omit에서 적용시켜주었습니다.

위 코드에서는 state에 타입을 씌워 타입 추론이 되게 하는 방법입니다.
(vue3가 되면 코어에 타입스크립트를 잘 씌울 수 있게 대응해 줬기 때문에 vue2에서는 이렇게 한다는 느낌으로다가 그냥 가볍게 보면 됩니다. )

### 2. mutation에 타입을 씌우기

mutation도 역시 vuex의 vue.d.ts에 타입을 알려주지 않는 이상 타입 추론이 일어나지 않습니다.
mutations의 타입을 곁들인 타입 파일이 필요한 시점입니다.

 - mutations 타입정의를 상수화

`data/enums/mutationTypes.ts`

```ts
export enum MutationTypes {
  SET_HOST = "SET_HOST",
}
```

- mutations 정의된 타입을 사용

`store/baseMutations.ts`

```ts
import Vue from 'vue'
import { MutationTypes } from '~/data/enums/mutationTypes'
import { MyRootState } from '~/store/state'
import { CookieParams, RemoveCookieParams } from '~/data/interface'

const rootMutations = {
  [MutationTypes.LOADING](state: MyRootState, isLoading: boolean) {
      Vue.set(state, 'isLoading', isLoading);
  },

type Mutations = typeof rootMutations

export { rootMutations, Mutations }
```

여기서 `[MutationTypes.LOADING]` -> 이 부분 좀 의아해 할 수 있는 부분인데, 상수화하는게 나중에 타입추론에서 이점을 얻을 수 있기때문에 상수화를 했고, 공식문서에서도 추천하고 있는 방법입니다. ([]이 문법은 es 6의 computed property name)

```ts
import { rootMutations } from '@/store/baseMutations'
import { smsMutations } from '@/store/sms/smsMutations'
import { sendHistoryMutations } from '@/store/sendHistory/sendHistoryMutations'

export const mutations = {
  ...rootMutations, ...smsMutations, ...memberMutations, ...sendHistoryMutations

}
```

`store/member/memberActions.ts`

```ts

type MyMemberActionContext = {
  commit<K extends keyof MemberMutations>(
    key: K,
    payload?: Parameters<MemberMutations[K]>[1]
  ): ReturnType<MemberMutations[K]>;
} & Omit<ActionContext<MemberState, MyRootState>, "commit">;


```

Omit<ActionContext<MemberState, MyRootState>, "commit"> & MyRootState -> 제네릭의 두 번째 param "commit"의 제외한 나머지 타입을 전부 받아들이고 내가 정의한 MyMutations가 commit 타입으로써 정의되는 것입니다.. 
이제 MyStore를 삽입시키면 됩니다.

`store/index.ts`
```ts
import { rootMutations } from '@/store/baseMutations'
import { smsMutations } from '@/store/sms/smsMutations'
import { sendHistoryMutations } from '@/store/sendHistory/sendHistoryMutations'

export const mutations = {
  ...rootMutations, ...smsMutations, ...memberMutations, ...sendHistoryMutations

}
```

![NavigationBar]({{ site.url }}{{ site.baseurl }}/images/2022/nuxt/mutations.png)
<span>내가 정의한 commit의 타입이 잘 읽어지고 있습니다..이런식으로 나머지 타입도 타입 정의를 시켜줍니다.</span>


### 3. actions에 타입을 씌우기 & store의 타입추론이 잘 이루어지게 프로젝트 레벨의 \*.d.ts 정의하기


1. `data/enums/actionTypes/ts`

```ts
export enum ActionTypes {
  LOGIN = 'LOGIN',
  // ...
}
```


2. `store/baseActions.ts`

```ts
import { ActionContext } from "vuex";
import { MyRootState } from "~/store/state";
import { Cookies } from "~/data/enums";
import { ActionTypes } from "~/data/enums/actionTypes";
import { MutationTypes } from "~/data/enums/mutationTypes";
import { Mutations } from "~/store/baseMutations";

type MyActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload?: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<MyRootState, MyRootState>, "commit">;

const rootActions = {
  nuxtServerInit(
    vuexContext: MyActionContext,
    { req }: any
  ) {
    // ...
    }
  },
};

type BaseActions = typeof rootActions;

export { rootActions, BaseActions };
```

3. `store/index.ts`

```ts
import { rootActions } from '~/store/baseActions'
import { memberActions } from '~/store/member/memberAction'
import { smsActions } from '~/store/sms/smsActions'

export const actions = {
  ...rootActions, ...memberActions, ...smsActions, ...sendHistoryActions
}


```

1. actions 이름을 상수화
2. context 타입을 내가 정의한 mutations로 ActionContext commit 부분만 커스텀해서 Omit해준다.
3. actions에 context타입에 커스텀한 ActionContext를 씌워준다.


`store/types.ts`

```ts

import { CommitOptions, DispatchOptions, Store } from "vuex";
import { Mutations } from "./baseMutations";
import { BaseActions } from '~/store/baseActions';
import { Getters } from '~/store/getters';
//...another

type MyMutations = {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>;
};

type MyActions = {
  dispatch<K extends keyof BaseActions>(
    key: K,
    payload?: Parameters<BaseActions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<BaseActions[K]>;
};

// ...another

```

지금까지 한 타입들을 정리하여 store/types.ts에 정의, 내 Store의 타입을 정의합니다.

`types/project.d.ts`

```ts
import Vue from "vue";
import { MyStore } from "~/store/types";

// TODO: `node_module/vuex/types/vue.d.ts` 파일을 삭제해줘야 아래 타입이 정상 추론됨

declare module "vue/types/vue" {
  interface Vue {
    $store: MyStore; 
  }
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    store?: MyStore; 
}
```

타입정의파일을 만들어
tsconfig.json에 내가 정의한 타입정의파일을 포함시켜 type intelligence가 읽어들이게 해줍니다.

![NavigationBar]({{ site.url }}{{ site.baseurl }}/images/2022/nuxt/store-type.png)

node_modules/vuex/type/vue.d.ts 파일을 삭제시켜주면 내가 정의한 project.d.ts로 $store의 타입 추론이 이루어지는걸 알수있습니다.

---




<br/>
읽어주셔서 감사합니다 🙇‍♀️
