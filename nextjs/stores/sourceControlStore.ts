import { create } from 'zustand';

export type SshKeyType = 'ed25519' | 'rsa';

export interface SourceControlPreferences {
  branchName: string;
  branches: string[];
  repositoryUrl: string;
  branchReadOnly: boolean;
  branchColor: string;
  connected: boolean;
  publicKey: string;
  keyGeneratorType: SshKeyType;
}

export interface SourceControlState {
  isEnterpriseSourceControlEnabled: boolean;
  sshKeyTypesWithLabel: { value: SshKeyType; label: string }[];
  preferences: SourceControlPreferences;
  state: { commitMessage: string };
}

export interface SourceControlActions {
  setPreferences: (data: Partial<SourceControlPreferences>) => void;
  setCommitMessage: (commitMessage: string) => void;
}

export type SourceControlStore = SourceControlState & SourceControlActions;

export const useSourceControlStore = create<SourceControlStore>((set) => ({
  isEnterpriseSourceControlEnabled: false,
  sshKeyTypesWithLabel: [
    { value: 'ed25519', label: 'ED25519' },
    { value: 'rsa', label: 'RSA' },
  ],
  preferences: {
    branchName: '',
    branches: [],
    repositoryUrl: '',
    branchReadOnly: false,
    branchColor: '#5296D6',
    connected: false,
    publicKey: '',
    keyGeneratorType: 'ed25519',
  },
  state: {
    commitMessage: 'commit message',
  },

  setPreferences: (data: Partial<SourceControlPreferences>) =>
    set((s) => ({ preferences: { ...s.preferences, ...data } })),

  setCommitMessage: (commitMessage: string) => set((s) => ({ state: { ...s.state, commitMessage } })),
}));

export default useSourceControlStore;

