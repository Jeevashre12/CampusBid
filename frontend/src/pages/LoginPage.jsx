import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { useAuth } from '../context/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [state, setState] = useState({ loading: false, error: '' });

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setState({ loading: true, error: '' });
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/marketplace', { replace: true });
    } catch (error) {
      setState({ loading: false, error: error.response?.data?.message || 'Unable to sign in. Please try again.' });
    }
  }

  return <><NavBar /><main className="auth-card">
    <p className="eyebrow">Welcome back</p><h1>Sign in</h1>
    <form onSubmit={submit}>
      <label>Email<input name="email" type="email" placeholder="you@campus.edu" value={form.email} onChange={updateField} required /></label>
      <label>Password<input name="password" type="password" value={form.password} onChange={updateField} minLength="8" required /></label>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button className="button" type="submit" disabled={state.loading}>{state.loading ? 'Signing in...' : 'Sign in'}</button>
    </form>
    <p className="muted">New here? <Link to="/register">Create an account</Link></p>
  </main></>;
}
