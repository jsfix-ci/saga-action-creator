import { ForkEffect } from 'redux-saga/effects';
import { ActionCreator, AnyAction } from 'redux';
import SagaActionCreator from '../lib/sagaActionCreator';
import { IPlugins } from './plugins';

export type ITakeType = (...args: any[]) => ForkEffect;
export type IEffect = (payload: any) => Iterator<any>;

export interface IHandleItem {
  takeType: ITakeType;
  effect: IEffect;
}

export type ISagaHandleItem = IEffect | IHandleItem;

export type ISagaRecord<Name> = {
  [T in keyof Name]: ISagaHandleItem;
};

type IActionCreator<P> = ActionCreator<AnyAction>;

/**
 * like so:
 * interface User {
 *   getUser: (payload: any) => AnyAction;
 *   test: (payload: any) => AnyAction;
 * }
 */
export type IActions<A> = {
  [K in keyof A]: IActionCreator<A[K]>;
};

/**
 * like so:
 * interface Actions {
 *   user: User
 * }
 */
export type IActionsRecord<A> = {
  [K in keyof A]: IActions<A[K]>;
};

/**
 * interface Creators {
 *   user: SagaActionCreator
 * }
 */
export type ICreatorRecord<S extends IActionsRecord<S>> = {
  [K in keyof S]: SagaActionCreator<S[K]>;
};

export interface IEffectRecord {
  actionKey: string;
  name: string;
  takeType?: ITakeType;
  effect: IEffect;
}

export type IEffectsRecord<S> = Record<keyof S, IEffectRecord>;

export interface IEffectRecordWithModule extends IEffectRecord {
  moduleName: string;
}

type ReturnUndefinedType<T extends ((...args: any) => any) | undefined> = T extends (...args: any) => infer R ? R : any;

export type IReducers<A extends IActionsRecord<A>, S> = {
  [T in keyof IPlugins<A, S>]: ReturnType<ReturnUndefinedType<IPlugins<A, S>[T]['getReducer']>>;
};
