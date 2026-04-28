import { create } from 'zustand';

const useTeamStore = create((set, get) => ({
  // State
  agency: null,        // { id, name, slug, logo_url, owner_id }
  members: [],         // [{ id, role, joined_at, user: { id, full_name, email, avatar_url } }]
  invitations: [],     // [{ id, email, role, created_at }]
  userRole: null,      // 'owner' | 'admin' | 'member' | 'viewer'
  activities: [],      // Activity feed items
  isTeamMode: false,   // Whether user belongs to a team
  loading: false,

  // Actions
  setTeam: (data) => {
    if (!data || !data.agency) {
      set({ agency: null, members: [], invitations: [], userRole: null, isTeamMode: false });
      return;
    }
    set({
      agency: data.agency,
      members: data.members || [],
      invitations: data.invitations || [],
      userRole: data.userRole,
      isTeamMode: true,
    });
  },

  setMembers: (members) => set({ members }),

  setActivities: (activities) => set({ activities }),

  addMember: (member) => set(state => ({
    members: [...state.members, member]
  })),

  removeMember: (memberId) => set(state => ({
    members: state.members.filter(m => m.id !== memberId)
  })),

  addActivity: (activity) => set(state => ({
    activities: [activity, ...state.activities].slice(0, 50)
  })),

  addInvitation: (invite) => set(state => ({
    invitations: [...state.invitations, invite]
  })),

  setLoading: (loading) => set({ loading }),

  reset: () => set({
    agency: null,
    members: [],
    invitations: [],
    userRole: null,
    activities: [],
    isTeamMode: false,
    loading: false,
  }),
}));

export default useTeamStore;
