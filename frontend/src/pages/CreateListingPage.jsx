import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import api from '../services/api';

const initialForm = {
  title: '',
  category: '',
  description: '',
  condition: '',
  startingPrice: '',
  minimumIncrement: '',
  closesAt: '',
  photos: ''
};

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState({ loading: false, error: '' });

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setState({ loading: true, error: '' });
    try {
      await api.post('/listings', {
        ...form,
        startingPrice: Number(form.startingPrice),
        minimumIncrement: Number(form.minimumIncrement),
        photos: form.photos ? form.photos.split(',').map((photo) => photo.trim()).filter(Boolean) : []
      });
      navigate('/marketplace');
    } catch (error) {
      setState({ loading: false, error: error.response?.data?.message || 'Unable to create the listing.' });
    }
  }

  return <><NavBar /><main className="auth-card listing-form">
    <p className="eyebrow">Sell on campus</p><h1>Create listing</h1>
    <form onSubmit={submit}>
      <label>Title<input name="title" value={form.title} onChange={updateField} maxLength="120" required /></label>
      <label>Category<input name="category" value={form.category} onChange={updateField} placeholder="Books, electronics, furniture..." required /></label>
      <label>Description<textarea name="description" value={form.description} onChange={updateField} maxLength="3000" rows="4" required /></label>
      <label>Condition<input name="condition" value={form.condition} onChange={updateField} placeholder="Good, like new..." required /></label>
      <label>Starting price<input name="startingPrice" type="number" min="0" step="0.01" value={form.startingPrice} onChange={updateField} required /></label>
      <label>Minimum bid increment<input name="minimumIncrement" type="number" min="1" step="0.01" value={form.minimumIncrement} onChange={updateField} required /></label>
      <label>Closing date and time<input name="closesAt" type="datetime-local" value={form.closesAt} onChange={updateField} required /></label>
      <label>Photo URLs <span className="muted">(comma-separated, optional)</span><input name="photos" value={form.photos} onChange={updateField} /></label>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button className="button" type="submit" disabled={state.loading}>{state.loading ? 'Creating listing...' : 'Create listing'}</button>
    </form>
  </main></>;
}

