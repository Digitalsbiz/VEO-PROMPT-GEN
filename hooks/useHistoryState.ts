
import { useState, useCallback } from 'react';

type HistoryState<T> = {
    past: T[];
    present: T;
    future: T[];
};

export const useHistoryState = <T>(initialState: T) => {
    const [state, setState] = useState<HistoryState<T>>({
        past: [],
        present: initialState,
        future: [],
    });

    const canUndo = state.past.length > 0;
    const canRedo = state.future.length > 0;

    const set = useCallback((newState: T) => {
        setState(currentState => {
            // Do not add to history if state is unchanged
            if (JSON.stringify(newState) === JSON.stringify(currentState.present)) {
                return currentState;
            }
            return {
                past: [...currentState.past, currentState.present],
                present: newState,
                future: [], // Clear future on new action
            };
        });
    }, []);

    const undo = useCallback(() => {
        setState(currentState => {
            if (!canUndo) return currentState;
            const previous = currentState.past[currentState.past.length - 1];
            const newPast = currentState.past.slice(0, currentState.past.length - 1);
            return {
                past: newPast,
                present: previous,
                future: [currentState.present, ...currentState.future],
            };
        });
    }, [canUndo]);

    const redo = useCallback(() => {
        setState(currentState => {
            if (!canRedo) return currentState;
            const next = currentState.future[0];
            const newFuture = currentState.future.slice(1);
            return {
                past: [...currentState.past, currentState.present],
                present: next,
                future: newFuture,
            };
        });
    }, [canRedo]);

    return {
        state: state.present,
        set,
        undo,
        redo,
        canUndo,
        canRedo,
    };
};
