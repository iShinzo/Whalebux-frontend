"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "../../lib/stores/userStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://whalebux-vercel.onrender.com/api";

interface User {
  telegramId: number;
  username: string;
  firstName: string;
  lastName: string;
  wbuxDollars: number;
  wbuxBalance: number;
  experience: number;
  level: number;
  loginStreak: number;
  miningRateLevel: number;
  miningBoostLevel: number;
  miningTimeLevel: number;
  nftSlotLevel: number;
  referralCount: number;
  referralBoost: number;
  friends: any[];
}

export default function AdminPage() {
  const [admin, setAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editDollars, setEditDollars] = useState(0);
  const [editBalance, setEditBalance] = useState(0);
  const [message, setMessage] = useState("");

  // Simple client-side password prompt
  useEffect(() => {
    if (admin) return;
    const saved = window.sessionStorage.getItem("admin-auth");
    if (saved === "true") setAdmin(true);
  }, [admin]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === "whalebuxadmin2024") {
      setAdmin(true);
      window.sessionStorage.setItem("admin-auth", "true");
    } else {
      setMessage("Incorrect password");
    }
  }

  // Fetch all users
  useEffect(() => {
    if (!admin) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/users`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [admin]);

  // Filter users
  const filtered = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.telegramId.toString().includes(search)
  );

  // Start editing a user
  function startEdit(user: User) {
    setEditUser(user);
    setEditDollars(user.wbuxDollars);
    setEditBalance(user.wbuxBalance);
    setMessage("");
  }

  // Save user edits
  async function saveEdit() {
    if (!editUser) return;
    setLoading(true);
    const res = await fetch(`${API_BASE_URL}/users/${editUser.telegramId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wbuxDollars: editDollars,
        wbuxBalance: editBalance,
        experience: editUser.experience,
        level: editUser.level,
        loginStreak: editUser.loginStreak,
        miningRateLevel: editUser.miningRateLevel,
        miningBoostLevel: editUser.miningBoostLevel,
        miningTimeLevel: editUser.miningTimeLevel,
        nftSlotLevel: editUser.nftSlotLevel,
        referralCount: editUser.referralCount,
        referralBoost: editUser.referralBoost,
        friends: editUser.friends,
        username: editUser.username,
        firstName: editUser.firstName,
        lastName: editUser.lastName,
      }),
    });
    if (res.ok) {
      setMessage("User updated!");
      setUsers((prev) =>
        prev.map((u) =>
          u.telegramId === editUser.telegramId
            ? { ...editUser, wbuxDollars: editDollars, wbuxBalance: editBalance } : u
        )
      );
      setEditUser(null);
    } else {
      setMessage("Failed to update user");
    }
    setLoading(false);
  }

  if (!admin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <form onSubmit={handleLogin} className="bg-gray-800 p-6 rounded-lg shadow max-w-xs w-full">
          <h2 className="text-xl font-bold text-white mb-4">Admin Login</h2>
          <input
            type="password"
            className="w-full p-2 rounded bg-gray-700 text-white mb-2"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded" type="submit">
            Login
          </button>
          {message && <div className="text-red-400 mt-2 text-sm">{message}</div>}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Admin Panel</h1>
      <div className="mb-4 flex flex-col md:flex-row gap-2 md:items-center">
        <input
          className="p-2 rounded bg-gray-800 text-white"
          placeholder="Search by username or Telegram ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
        />
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded mt-2 md:mt-0"
          onClick={() => setSearch(search.trim())}
        >
          Search
        </button>
        {search && (
          <button
            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded mt-2 md:mt-0"
            onClick={() => setSearch("")}
          >
            Clear
          </button>
        )}
      </div>
      {loading && <div className="text-white">Loading...</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((user) => (
          <div key={user.telegramId} className="bg-gray-800 rounded-lg p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-white font-bold">{user.firstName} {user.lastName}</div>
                <div className="text-gray-400 text-sm">@{user.username}</div>
                <div className="text-gray-400 text-xs">Telegram ID: {user.telegramId}</div>
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
                onClick={() => startEdit(user)}
              >
                Edit
              </button>
            </div>
            <div className="flex gap-4 mt-2">
              <div className="bg-gray-700 rounded p-2 flex-1">
                <div className="text-xs text-gray-400">WBUX Dollars</div>
                <div className="text-green-400 font-bold">${user.wbuxDollars}</div>
              </div>
              <div className="bg-gray-700 rounded p-2 flex-1">
                <div className="text-xs text-gray-400">WBUX Tokens</div>
                <div className="text-blue-400 font-bold">{user.wbuxBalance}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow max-w-xs w-full overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold text-white mb-4">Edit User</h2>
            <div className="mb-2 text-gray-400">{editUser.firstName} {editUser.lastName} (@{editUser.username})</div>
            <label className="block text-gray-400 text-sm mb-1">Username</label>
            <input type="text" className="w-full p-2 rounded bg-gray-700 text-white mb-2" value={editUser.username} onChange={e => setEditUser({ ...editUser, username: e.target.value })} />
            <label className="block text-gray-400 text-sm mb-1">First Name</label>
            <input type="text" className="w-full p-2 rounded bg-gray-700 text-white mb-2" value={editUser.firstName} onChange={e => setEditUser({ ...editUser, firstName: e.target.value })} />
            <label className="block text-gray-400 text-sm mb-1">Last Name</label>
            <input type="text" className="w-full p-2 rounded bg-gray-700 text-white mb-2" value={editUser.lastName} onChange={e => setEditUser({ ...editUser, lastName: e.target.value })} />
            <label className="block text-gray-400 text-sm mb-1">Experience</label>
            <input type="number" className="w-full p-2 rounded bg-gray-700 text-white mb-2" value={editUser.experience} onChange={e => setEditUser({ ...editUser, experience: Number(e.target.value) })} />
            <label className="block text-gray-400 text-sm mb-1">Level</label>
            <input type="number" className="w-full p-2 rounded bg-gray-700 text-white mb-2" value={editUser.level} onChange={e => setEditUser({ ...editUser, level: Number(e.target.value) })} />
            <label className="block text-gray-400 text-sm mb-1">Login Streak</label>
            <input type="number" className="w-full p-2 rounded bg-gray-700 text-white mb-2" value={editUser.loginStreak} onChange={e => setEditUser({ ...editUser, loginStreak: Number(e.target.value) })} />
            <label className="block text-gray-400 text-sm mb-1">Mining Rate Level</label>
            <input type="number" className="w-full p-2 rounded bg-gray-700 text-white mb-2" value={editUser.miningRateLevel} onChange={e => setEditUser({ ...editUser, miningRateLevel: Number(e.target.value) })} />
            <label className="block text-gray-400 text-sm mb-1">Mining Boost Level</label>
            <input type="number" className="w-full p-2 rounded bg-gray-700 text-white mb-2" value={editUser.miningBoostLevel} onChange={e => setEditUser({ ...editUser, miningBoostLevel: Number(e.target.value) })} />
            <label className="block text-gray-400 text-sm mb-1">Mining Time Level</label>
            <input type="number" className="w-full p-2 rounded bg-gray-700 text-white mb-2" value={editUser.miningTimeLevel} onChange={e => setEditUser({ ...editUser, miningTimeLevel: Number(e.target.value) })} />
            <label className="block text-gray-400 text-sm mb-1">NFT Slot Level</label>
            <input type="number" className="w-full p-2 rounded bg-gray-700 text-white mb-2" value={editUser.nftSlotLevel} onChange={e => setEditUser({ ...editUser, nftSlotLevel: Number(e.target.value) })} />
            <label className="block text-gray-400 text-sm mb-1">Referral Count</label>
            <input type="number" className="w-full p-2 rounded bg-gray-700 text-white mb-2" value={editUser.referralCount} onChange={e => setEditUser({ ...editUser, referralCount: Number(e.target.value) })} />
            <label className="block text-gray-400 text-sm mb-1">Referral Boost</label>
            <input type="number" className="w-full p-2 rounded bg-gray-700 text-white mb-2" value={editUser.referralBoost} onChange={e => setEditUser({ ...editUser, referralBoost: Number(e.target.value) })} />
            <label className="block text-gray-400 text-sm mb-1">Friends (JSON)</label>
            <textarea className="w-full p-2 rounded bg-gray-700 text-white mb-4" rows={2} value={JSON.stringify(editUser.friends)} onChange={e => {
              try {
                setEditUser({ ...editUser, friends: JSON.parse(e.target.value) });
              } catch {
                // ignore parse errors
              }
            }} />
            <label className="block text-gray-400 text-sm mb-1">WBUX Dollars</label>
            <input type="number" className="w-full p-2 rounded bg-gray-700 text-white mb-2" value={editDollars} onChange={e => setEditDollars(Number(e.target.value))} />
            <label className="block text-gray-400 text-sm mb-1">WBUX Tokens</label>
            <input type="number" className="w-full p-2 rounded bg-gray-700 text-white mb-4" value={editBalance} onChange={e => setEditBalance(Number(e.target.value))} />
            <div className="flex gap-2">
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm flex-1" onClick={saveEdit} disabled={loading}>Save</button>
              <button className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm flex-1" onClick={() => setEditUser(null)} disabled={loading}>Cancel</button>
            </div>
            {message && <div className="text-green-400 mt-2 text-sm">{message}</div>}
            <div className="text-xs text-gray-400 mt-2">Admin password: <span className="text-white font-mono">whalebuxadmin2024</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
