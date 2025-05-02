import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from '@aws-amplify/api';
import config from './aws-exports';
import { Button, TextField } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// Configure Amplify
Amplify.configure(config);
const client = generateClient();

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchProducts = async () => {
    setLoading(true);
    try {
      const result = await client.graphql({
        query: `
          query SearchProducts($query: String!) {
            searchProducts(query: $query) {
              id
              name
              price
              category
            }
          }
        `,
        variables: { query }
      });
      setResults(result.data.searchProducts);
    } catch (err) {
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#1a365d', marginBottom: '2rem' }}>
        🔍 Product Search Demo
      </h1>

      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem'
      }}>
        <TextField
          placeholder="Search products (e.g. 'electronics')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flexGrow: 1 }}
        />
        <Button 
          onClick={searchProducts}
          variation="primary"
          isLoading={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {results.length > 0 ? (
        <div>
          <h2 style={{ color: '#2d3748', marginBottom: '1rem' }}>Results</h2>
          <div style={{ 
            display: 'grid', 
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))'
          }}>
            {results.map((product) => (
              <div 
                key={product.id}
                style={{
                  padding: '1rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <h3 style={{ 
                  margin: '0 0 0.5rem 0',
                  color: '#2d3748'
                }}>
                  {product.name}
                </h3>
                <div style={{ color: '#4a5568' }}>
                  <p>Price: ${product.price}</p>
                  <p>Category: {product.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          color: '#718096'
        }}>
          No results found. Try searching for products!
        </div>
      )}
    </div>
  );
}

export default App;