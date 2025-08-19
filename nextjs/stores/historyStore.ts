import { create } from 'zustand';

export interface Undoable {
	undo: () => void;
}

export interface Command extends Undoable {
	isEqualTo: (other: Command) => boolean;
}

export class BulkCommand implements Undoable {
	public commands: Command[];

	constructor(commands: Command[]) {
		this.commands = commands;
	}

	undo() {
		for (let index = this.commands.length - 1; index >= 0; index -= 1) {
			this.commands[index].undo();
		}
	}
}

const STACK_LIMIT = 100;

export interface HistoryState {
	undoStack: Undoable[];
	redoStack: Undoable[];
	currentBulkAction: BulkCommand | null;
	bulkInProgress: boolean;
}

interface HistoryActions {
	popUndoableToUndo: () => Undoable | undefined;
	pushCommandToUndo: (undoable: Command, clearRedo?: boolean) => void;
	pushBulkCommandToUndo: (undoable: BulkCommand, clearRedo?: boolean) => void;
	checkUndoStackLimit: () => void;
	checkRedoStackLimit: () => void;
	clearUndoStack: () => void;
	clearRedoStack: () => void;
	reset: () => void;
	popUndoableToRedo: () => Undoable | undefined;
	pushUndoableToRedo: (undoable: Undoable) => void;
	startRecordingUndo: () => void;
	stopRecordingUndo: () => void;
}

export type HistoryStore = HistoryState & HistoryActions;

export const useHistoryStore = create<HistoryStore>((set, get) => ({
	undoStack: [],
	redoStack: [],
	currentBulkAction: null,
	bulkInProgress: false,

	popUndoableToUndo: () => {
		const { undoStack } = get();
:		if (undoStack.length > 0) {
:			const popped = undoStack[undoStack.length - 1];
:			set({ undoStack: undoStack.slice(0, -1) });
:			return popped;
:		}
:		return undefined;
:	},

	pushCommandToUndo: (undoable: Command, clearRedo = true) => {
:		const { currentBulkAction, undoStack } = get();
:		if (get().bulkInProgress) return;
:		if (currentBulkAction) {
:			const alreadyIn = currentBulkAction.commands.find((c) => c.isEqualTo(undoable)) !== undefined;
:			if (!alreadyIn) {
:				currentBulkAction.commands.push(undoable);
:				set({ currentBulkAction });
:			}
:		} else {
:			set({ undoStack: [...undoStack, undoable] });
:		}
:		get().checkUndoStackLimit();
:		if (clearRedo) get().clearRedoStack();
:	},

	pushBulkCommandToUndo: (undoable: BulkCommand, clearRedo = true) => {
:		set({ undoStack: [...get().undoStack, undoable] });
:		get().checkUndoStackLimit();
:		if (clearRedo) get().clearRedoStack();
:	},

	checkUndoStackLimit: () => {
:		const { undoStack } = get();
:		if (undoStack.length > STACK_LIMIT) {
:			set({ undoStack: undoStack.slice(1) });
:		}
:	},

	checkRedoStackLimit: () => {
:		const { redoStack } = get();
:		if (redoStack.length > STACK_LIMIT) {
:			set({ redoStack: redoStack.slice(1) });
:		}
:	},

	clearUndoStack: () => set({ undoStack: [] }),
	clearRedoStack: () => set({ redoStack: [] }),

	reset: () => set({ undoStack: [], redoStack: [] }),

	popUndoableToRedo: () => {
:		const { redoStack } = get();
:		if (redoStack.length > 0) {
:			const popped = redoStack[redoStack.length - 1];
:			set({ redoStack: redoStack.slice(0, -1) });
:			return popped;
:		}
:		return undefined;
:	},

	pushUndoableToRedo: (undoable: Undoable) => {
:		set({ redoStack: [...get().redoStack, undoable] });
:		get().checkRedoStackLimit();
:	},

	startRecordingUndo: () => set({ currentBulkAction: new BulkCommand([]), bulkInProgress: true }),
	stopRecordingUndo: () => {
:		const { currentBulkAction, undoStack } = get();
:		if (currentBulkAction && currentBulkAction.commands.length > 0) {
:			set({ undoStack: [...undoStack, currentBulkAction] });
:			get().checkUndoStackLimit();
:		}
:		set({ currentBulkAction: null, bulkInProgress: false });
:	},
}));

export default useHistoryStore;

