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
  photos: []
};

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState({ loading: false, error: '' });

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function updatePhotos(event) {
    setForm((current) => ({ ...current, photos: Array.from(event.target.files || []) }));
  }

  async function submit(event) {
    event.preventDefault();
    setState({ loading: true, error: '' });
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== 'photos') payload.append(key, value);
      });
      form.photos.forEach((photo) => payload.append('photos', photo));
      await api.post('/listings', payload);
      navigate('/marketplace');
    } catch (error) {
      setState({ loading: false, error: error.response?.data?.message || (error.request ? 'The CampusBid server could not be reached. Make sure the backend is running on port 5001.' : 'Unable to create the listing.') });
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
      <label>Photos <span className="muted">(up to 5 images, 5 MB each)</span><input name="photos" type="file" accept="image/*" multiple onChange={updatePhotos} /></label>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button className="button" type="submit" disabled={state.loading}>{state.loading ? 'Creating listing...' : 'Create listing'}</button>
    </form>
  </main></>;
}
