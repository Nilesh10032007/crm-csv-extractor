import { parseCSVString } from './csvService';

describe('csvService', () => {
  it('should parse simple CSV correctly', () => {
    const csv = 'name,email\nJohn Doe,john@example.com\nJane,jane@example.com';
    const result = parseCSVString(csv);
    
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('John Doe');
    expect(result[1].email).toBe('jane@example.com');
  });

  it('should skip empty lines', () => {
    const csv = 'name,email\n\nJohn,john@example.com\n\n';
    const result = parseCSVString(csv);
    
    expect(result).toHaveLength(1);
  });
});
