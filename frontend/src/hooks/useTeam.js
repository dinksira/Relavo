import { useState, useEffect, useCallback } from 'react';
import { teamAPI } from '../services/api';
import useTeamStore from '../store/teamStore';
import useToast from './useToast';

const useTeam = () => {
  const toast = useToast();
  const {
    agency, members, userRole, activities, isTeamMode, loading,
    setTeam, setMembers, setActivities, addMember, removeMember: removeFromStore,
    setLoading, reset
  } = useTeamStore();

  // Fetch team data on mount
  const fetchTeam = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await teamAPI.getTeam();
      setTeam(data?.data || null);
    } catch (err) {
      console.error('Failed to fetch team:', err);
    } finally {
      setLoading(false);
    }
  }, [setTeam, setLoading]);

  // Fetch activity feed
  const fetchActivity = useCallback(async () => {
    if (!isTeamMode) return;
    try {
      const { data } = await teamAPI.getActivity();
      setActivities(data?.data || []);
    } catch (err) {
      console.error('Failed to fetch activity:', err);
    }
  }, [isTeamMode, setActivities]);

  // Create a new team workspace
  const createTeam = async (name) => {
    try {
      const { data } = await teamAPI.createTeam(name);
      if (data?.success) {
        await fetchTeam();
        toast.success(data.message || 'Team workspace created!');
        return data.data;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create team');
      throw err;
    }
  };

  // Invite a new member
  const inviteMember = async (email, role = 'member') => {
    try {
      const { data } = await teamAPI.inviteMember(email, role);
      if (data?.success) {
        addMember(data.data);
        toast.success(data.message || 'Member invited!');
        return data.data;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to invite member');
      throw err;
    }
  };

  // Update a member's role
  const updateRole = async (memberId, role) => {
    try {
      await teamAPI.updateRole(memberId, role);
      // Refresh members list
      const { data } = await teamAPI.getMembers();
      setMembers(data?.data || []);
      toast.success('Role updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  // Remove a member
  const removeMember = async (memberId) => {
    try {
      await teamAPI.removeMember(memberId);
      removeFromStore(memberId);
      toast.success('Member removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  // Leave current team
  const leaveTeam = async () => {
    try {
      const { data } = await teamAPI.leaveTeam();
      if (data?.success) {
        reset(); // Clear team state locally
        toast.success('You have left the team workspace');
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to leave team');
      return false;
    }
  };

  return {
    agency,
    members,
    userRole,
    activities,
    isTeamMode,
    loading,
    fetchTeam,
    fetchActivity,
    createTeam,
    inviteMember,
    updateRole,
    removeMember,
    leaveTeam,
  };
};

export default useTeam;
