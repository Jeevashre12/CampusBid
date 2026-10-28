import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
export default function LoginPage() { return <><NavBar /><main className="auth-card"><p className="eyebrow">Welcome back</p><h1>Sign in</h1><form><label>Email<input type="email" placeholder="you@campus.edu" required /></label><label>Password<input type="password" required /></label><button className="button" type="submit">Sign in</button></form><p className="muted">New here? <Link to="/register">Create an account</Link></p></main></>; }

