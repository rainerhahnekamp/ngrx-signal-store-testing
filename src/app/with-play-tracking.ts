import {patchState, signalStoreFeature, withMethods, withState} from "@ngrx/signals";

type PlayTrackingState = {
  _currentId: number;
  _status: 'playing' | 'stopped';
  _startedAt: Date | undefined;
  trackedData: Record<number, number>;
};

const initialState: PlayTrackingState = {
  _currentId: 0,
  _status: 'stopped',
  _startedAt: undefined,
  trackedData: {},
};


export const withPlayTracking = () => signalStoreFeature(
  withState(initialState),
  withMethods((store) => {
    const stop = () => {
      const startedAt = store._startedAt();
      if (!startedAt || store._status() === 'stopped') {
        return;
      }

      const timeSpent = new Date().getTime() - startedAt.getTime();
      const alreadySpent = store.trackedData()[store._currentId()] ?? 0;
      patchState(store, (state) => ({
        _currentId: 0,
        _status: 'stopped' as const,
        trackedData: {...state.trackedData, [state._currentId]: alreadySpent + timeSpent},
      }));
    };

    return {
      play(id: number) {
        stop();
        patchState(store, {
          _currentId: id,
          _status: 'playing',
          _startedAt: new Date(),
        });
      },
      stop
    }
  })
);
