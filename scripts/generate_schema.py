import sqlite3
import os

def generate_mermaid():
    db_path = os.path.join(os.path.dirname(__file__), '../backend/kalharam.db')
    
    if not os.path.exists(db_path):
        print(f"Error: Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall() if row[0] != 'sqlite_sequence']

    mermaid_code = ["erDiagram"]

    for table in tables:
        # Get schema
        cursor.execute(f"PRAGMA table_info({table});")
        columns = cursor.fetchall()
        
        # Get count
        cursor.execute(f"SELECT COUNT(*) FROM {table};")
        count = cursor.fetchone()[0]

        mermaid_code.append(f"    {table} {{")
        mermaid_code.append(f"        %% Rows: {count}")
        for col in columns:
            col_id, name, type_, notnull, default_val, pk = col
            pk_str = " PK" if pk else ""
            mermaid_code.append(f"        {type_} {name}{pk_str}")
        mermaid_code.append("    }")

        # Get foreign keys
        cursor.execute(f"PRAGMA foreign_key_list({table});")
        fks = cursor.fetchall()
        for fk in fks:
            fk_id, seq, table_to, from_col, to_col, on_update, on_delete, match = fk
            mermaid_code.append(f"    {table} }}o--|| {table_to} : references")

    conn.close()

    output = "\n".join(mermaid_code)
    
    out_path = os.path.join(os.path.dirname(__file__), 'db_schema.mermaid')
    with open(out_path, 'w') as f:
        f.write(output)
        
    print(f"Mermaid diagram generated successfully at {out_path}")
    print("\n--- Diagram Preview ---\n")
    print(output)

if __name__ == "__main__":
    generate_mermaid()
