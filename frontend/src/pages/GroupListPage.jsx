
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGroups } from '../hooks/useGroups.js';

function GroupListPage() {
  const { groups, loading, error, loadGroups, addGroup } = useGroups();
  const [name, setName] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadGroups();
  }, []);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    
    try {
      await addGroup(name);
      setName('');
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div>
      <h1>Groups</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="group-name">New group name</label>
        <input
          id="group-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <button type="submit">Create group</button>
      </form>
      {formError && <p>{formError}</p>}
      {loading && <p>Loading groups...</p>}
      {error && <p>{error}</p>}
      {!loading && groups.length === 0 && <p>No groups yet.</p>}
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            <Link to={`/groups/${group.id}`}>{group.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupListPage;