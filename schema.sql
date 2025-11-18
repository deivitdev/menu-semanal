-- Schema para Menu Semanal Database
DROP TABLE IF EXISTS shopping_lists;

CREATE TABLE shopping_lists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Lista de Compras',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS ingredients;

CREATE TABLE ingredients (
    id TEXT PRIMARY KEY,
    shopping_list_id TEXT NOT NULL,
    name TEXT NOT NULL,
    quantity TEXT,
    unit TEXT,
    observations TEXT,
    is_checked BOOLEAN DEFAULT FALSE,
    category TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shopping_list_id) REFERENCES shopping_lists(id) ON DELETE CASCADE
);

-- Insertar lista de compras por defecto
INSERT OR IGNORE INTO shopping_lists (id, name) VALUES ('default', 'Lista de Compras Principal');
