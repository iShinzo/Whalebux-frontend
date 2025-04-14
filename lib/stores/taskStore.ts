"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUserStore } from "./userStore";

export type TaskType = "AIRDROP" | "CHANNEL_JOIN" | "REFERRAL" | "SOCIAL" | "REVIEW";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DENIED";
export type RewardType = "DOLLARS" | "TOKENS";

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  reward: number;
  rewardType: RewardType;
  creatorId: string;
  creatorName: string;
  status: TaskStatus;
  assignedTo?: string;
  assignedToName?: string;
  link?: string;
  proofRequired: boolean;
  proofSubmitted?: string;
  createdAt: string;
  completedAt?: string;
  isAdminTask: boolean;
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "status" | "createdAt" | "creatorId" | "creatorName" | "isAdminTask">) => void;
  addAdminTask: (task: Omit<Task, "id" | "status" | "createdAt" | "creatorId" | "creatorName" | "isAdminTask">) => void;
  getAvailableTasks: (userId: string) => Task[];
  getMyCreatedTasks: (userId: string) => Task[];
  getMyAssignedTasks: (userId: string) => Task[];
  getAdminTasks: () => Task[];
  getPendingTasksCount: (userId: string) => number;
  getActiveTasksCount: (userId: string) => number;
  getTaskBoostPoints: (userId: string) => number;
  applyForTask: (taskId: string, userId: string, userName: string) => void;
  submitProof: (taskId: string, proofText: string) => void;
  approveTask: (taskId: string) => void;
  denyTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (taskData) => {
        const userState = useUserStore.getState();
        const newTask: Task = {
          id: `task_${Math.random().toString(36).substring(2, 9)}`,
          creatorId: userState.userId || "unknown",
          creatorName: userState.username || "unknown",
          status: "PENDING",
          createdAt: new Date().toISOString(),
          isAdminTask: false,
          ...taskData, // Use proofRequired from taskData
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));

        // Deduct the reward from the creator's balance
        if (taskData.rewardType === "DOLLARS") {
          useUserStore.setState({ wbuxDollars: userState.wbuxDollars - taskData.reward });
        } else {
          useUserStore.setState({ wbuxBalance: userState.wbuxBalance - taskData.reward });
        }
      },

      addAdminTask: (taskData) => {
        const newTask: Task = {
          id: `admin_task_${Math.random().toString(36).substring(2, 9)}`,
          creatorId: "admin",
          creatorName: "WhaleBux Admin",
          status: "PENDING",
          createdAt: new Date().toISOString(),
          isAdminTask: true,
          ...taskData, // Use proofRequired from taskData
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      getAvailableTasks: (userId) => {
        return get().tasks.filter(
          (task) => task.status === "PENDING" && task.creatorId !== userId && !task.assignedTo,
        );
      },

      getMyCreatedTasks: (userId) => {
        return get().tasks.filter((task) => task.creatorId === userId);
      },

      getMyAssignedTasks: (userId) => {
        return get().tasks.filter((task) => task.assignedTo === userId);
      },

      getAdminTasks: () => {
        return get().tasks.filter((task) => task.isAdminTask && task.status === "PENDING");
      },

      getPendingTasksCount: (userId) => {
        return get().tasks.filter((task) => task.status === "PENDING" && task.assignedTo === userId).length;
      },

      getActiveTasksCount: (userId) => {
        return get().tasks.filter((task) => task.status === "IN_PROGRESS" && task.assignedTo === userId).length;
      },

      getTaskBoostPoints: (userId) => {
        return get().tasks.filter((task) => task.status === "COMPLETED" && task.assignedTo === userId).length * 5; // 5 points per completed task
      },

      applyForTask: (taskId, userId, userName) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: "IN_PROGRESS",
                  assignedTo: userId,
                  assignedToName: userName,
                }
              : task,
          ),
        }));
      },

      submitProof: (taskId, proofText) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  proofSubmitted: proofText,
                }
              : task,
          ),
        }));
      },

      approveTask: (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task || !task.assignedTo) return;

        // Update task status
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: "COMPLETED",
                  completedAt: new Date().toISOString(),
                }
              : t,
          ),
        }));

        // Add reward to the assigned user's balance
        const userState = useUserStore.getState();
        if (task.rewardType === "DOLLARS") {
          useUserStore.setState({ wbuxDollars: userState.wbuxDollars + task.reward });
        } else {
          useUserStore.setState({ wbuxBalance: userState.wbuxBalance + task.reward });
        }
      },

      denyTask: (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task) return;

        // Update task status
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: "DENIED",
                  assignedTo: undefined,
                  assignedToName: undefined,
                  proofSubmitted: undefined,
                }
              : t,
          ),
        }));

        // Return the reward to the creator's balance (if not an admin task)
        if (!task.isAdminTask) {
          const userState = useUserStore.getState();
          if (task.rewardType === "DOLLARS") {
            useUserStore.setState({ wbuxDollars: userState.wbuxDollars + task.reward });
          } else {
            useUserStore.setState({ wbuxBalance: userState.wbuxBalance + task.reward });
          }
        }
      },

      deleteTask: (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task || task.status !== "PENDING") return;

        // Remove the task
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
        }));

        // Return the reward to the creator's balance (if not an admin task)
        if (!task.isAdminTask) {
          const userState = useUserStore.getState();
          if (task.rewardType === "DOLLARS") {
            useUserStore.setState({ wbuxDollars: userState.wbuxDollars + task.reward });
          } else {
            useUserStore.setState({ wbuxBalance: userState.wbuxBalance + task.reward });
          }
        }
      },
    }),
    {
      name: "whalebux-task-storage",
    },
  ),
);
