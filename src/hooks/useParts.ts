import { useState, useCallback, useEffect } from 'react';

export interface Part {
  id: string;
  code: string;
  description: string;
  value: number;
  quantity: number;
  category: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for demo
const MOCK_PARTS: Part[] = [
  {
    id: '1',
    code: 'COMP-001',
    description: 'Compressor 2HP',
    value: 1200,
    quantity: 3,
    category: 'refrigeração',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    code: 'TERM-001',
    description: 'Termostato Digital',
    value: 150,
    quantity: 10,
    category: 'refrigeração',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    code: 'CABO-001',
    description: 'Cabo Elétrico 2.5mm',
    value: 25,
    quantity: 50,
    category: 'elétrica',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function useParts() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadParts = useCallback(() => {
    try {
      setLoading(true);
      // Try to load from localStorage
      const stored = localStorage.getItem('parts');
      if (stored) {
        setParts(JSON.parse(stored));
      } else {
        // Use mock data on first load
        setParts(MOCK_PARTS);
        localStorage.setItem('parts', JSON.stringify(MOCK_PARTS));
      }
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load parts';
      setError(message);
      setParts(MOCK_PARTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadParts();
  }, [loadParts]);

  const createPart = useCallback(
    async (partData: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const newPart: Part = {
          ...partData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const updated = [...parts, newPart];
        setParts(updated);
        localStorage.setItem('parts', JSON.stringify(updated));
        return newPart;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create part';
        setError(message);
        throw err;
      }
    },
    [parts]
  );

  const updatePart = useCallback(
    async (id: string, partData: Partial<Part>) => {
      try {
        const updated = parts.map(p =>
          p.id === id
            ? {
                ...p,
                ...partData,
                updatedAt: new Date(),
              }
            : p
        );
        setParts(updated);
        localStorage.setItem('parts', JSON.stringify(updated));
        return updated.find(p => p.id === id)!;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update part';
        setError(message);
        throw err;
      }
    },
    [parts]
  );

  const deletePart = useCallback(
    async (id: string) => {
      try {
        const updated = parts.filter(p => p.id !== id);
        setParts(updated);
        localStorage.setItem('parts', JSON.stringify(updated));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete part';
        setError(message);
        throw err;
      }
    },
    [parts]
  );

  const getPartById = useCallback(
    (id: string) => {
      return parts.find(p => p.id === id) || null;
    },
    [parts]
  );

  const decreasePartQuantity = useCallback(
    async (id: string, quantity: number) => {
      try {
        const part = parts.find(p => p.id === id);
        if (!part) throw new Error('Peça não encontrada');
        if (part.quantity < quantity) throw new Error('Quantidade insuficiente');
        return updatePart(id, { quantity: part.quantity - quantity });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to decrease';
        setError(message);
        throw err;
      }
    },
    [parts, updatePart]
  );

  const searchParts = useCallback(
    (searchTerm: string) => {
      if (!searchTerm) return parts;
      const term = searchTerm.toLowerCase();
      return parts.filter(p => 
        p.code.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term)
      );
    },
    [parts]
  );

  const updatePartQuantity = useCallback(
    async (id: string, newQuantity: number) => {
      try {
        return updatePart(id, { quantity: newQuantity });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update quantity';
        setError(message);
        throw err;
      }
    },
    [updatePart]
  );

  return {
    parts,
    loading,
    error,
    createPart,
    updatePart,
    deletePart,
    loadParts,
    getPartById,
    decreasePartQuantity,
    searchParts,
    updatePartQuantity,
  };
}
