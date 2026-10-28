import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { useAuth } from '../context/useAuth';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [state, setState] = useState({ loading: false, error: '' });

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setState({ loading: false, error: 'Passwords do not match.' });
      return;
    }
    setState({ loading: true, error: '' });
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/marketplace', { replace: true });
    } catch (error) {
      setState({ loading: false, error: error.response?.data?.message || 'Unable to create your account. Please try again.' });
    }
  }

  return <><NavBar /><main className="auth-card">
    <p className="eyebrow">Join the campus marketplace</p><h1>Create account</h1>
    <form onSubmit={submit}>
      <label>Full name<input name="name" type="text" value={form.name} onChange={updateField} autoComplete="name" required /></label>
      <label>Campus email<input name="email" type="email" placeholder="you@campus.edu" value={form.email} onChange={updateField} autoComplete="email" required /></label>
      <label>Password<input name="password" type="password" value={form.password} onChange={updateField} minLength="8" autoComplete="new-password" required /></label>
      <label>Confirm password<input name="confirmPassword" type="password" value={form.confirmPassword} onChange={updateField} minLength="8" autoComplete="new-password" required /></label>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button className="button" type="submit" disabled={state.loading}>{state.loading ? 'Creating account...' : 'Create account'}</button>
    </form>
    <p className="muted">Already registered? <Link to="/login">Sign in</Link></p>
  </main></>;
}
