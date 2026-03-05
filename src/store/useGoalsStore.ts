import { create } from 'zustand';
import {
  Goal, GoalLink, NewGoal, NewGoalLink,
  getAllGoals, insertGoal, updateGoal, deleteGoal,
  getGoalLinks, insertGoalLink, deleteGoalLink, deleteAllGoalLinks
} from '../db/queries/goals';

interface GoalsState {
  goals: Goal[];
  links: Record<number, GoalLink[]>;
  loading: boolean;
  load: () => void;
  loadLinks: (goalId: number) => void;
  add: (goal: NewGoal) => number;
  update: (id: number, goal: Partial<NewGoal>) => void;
  remove: (id: number) => void;
  addLink: (link: NewGoalLink) => void;
  removeLink: (linkId: number, goalId: number) => void;
  clearLinks: (goalId: number) => void;
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: [],
  links: {},
  loading: false,

  load: () => {
    set({ loading: true });
    try {
      const goals = getAllGoals();
      set({ goals, loading: false });
    } catch (e) {
      set({ loading: false });
    }
  },

  loadLinks: (goalId) => {
    const links = getGoalLinks(goalId);
    set(state => ({ links: { ...state.links, [goalId]: links } }));
  },

  add: (goal) => {
    const id = insertGoal(goal);
    get().load();
    return id;
  },

  update: (id, goal) => {
    updateGoal(id, goal);
    get().load();
  },

  remove: (id) => {
    deleteGoal(id);
    get().load();
  },

  addLink: (link) => {
    insertGoalLink(link);
    get().loadLinks(link.goal_id);
  },

  removeLink: (linkId, goalId) => {
    deleteGoalLink(linkId);
    get().loadLinks(goalId);
  },

  clearLinks: (goalId) => {
    deleteAllGoalLinks(goalId);
    get().loadLinks(goalId);
  },
}));

