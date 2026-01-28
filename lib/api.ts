import { API_BASE, buildUrl } from './config';
import { getToken } from './auth';

async function handleResponse(res: Response) {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const message = isJson && body?.message ? body.message : res.statusText;
    throw new Error(message);
  }
  return body;
}

function authHeaders(contentTypeJson = true) {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (contentTypeJson) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: 'POST',
    headers: authHeaders(true),
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(res);
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: authHeaders(true),
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function getUserProfile() {
  const res = await fetch(`${API_BASE}/users/profile`, {
    headers: authHeaders(false),
  });
  return handleResponse(res);
}

export async function getBlogs(params?: { page?: number; size?: number; title?: string; author?: string }) {
  const url = buildUrl('/blogs', {
    page: params?.page ?? 0,
    size: params?.size ?? 20,
    title: params?.title,
    author: params?.author,
  });
  const res = await fetch(url, { headers: authHeaders(false) });
  return handleResponse(res);
}

export async function getBlog(id: string) {
  const res = await fetch(`${API_BASE}/blogs/${id}`, { headers: authHeaders(false) });
  return handleResponse(res);
}

export async function createBlog(title: string, content: string, image?: File) {
  const form = new FormData();
  form.append('title', title);
  form.append('content', content);
  if (image) form.append('image', image);

  const res = await fetch(`${API_BASE}/blogs`, {
    method: 'POST',
    headers: authHeaders(false),
    body: form,
  });
  return handleResponse(res);
}

export async function updateBlog(id: string, title: string, content: string) {
  const res = await fetch(`${API_BASE}/blogs/${id}`, {
    method: 'PUT',
    headers: authHeaders(true),
    body: JSON.stringify({ title, content }),
  });
  return handleResponse(res);
}

export async function deleteBlog(id: string) {
  const res = await fetch(`${API_BASE}/blogs/${id}`, { method: 'DELETE', headers: authHeaders(false) });
  return handleResponse(res);
}
