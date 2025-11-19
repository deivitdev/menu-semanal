-- Schema optimizado para mejor rendimiento

-- Tabla de listas de compras con índices
CREATE TABLE IF NOT EXISTS shopping_lists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ingredientes con índices optimizados
CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shopping_list_id TEXT NOT NULL,
    name TEXT NOT NULL,
    quantity TEXT,
    unit TEXT,
    observations TEXT,
    is_checked INTEGER DEFAULT 0,
    category TEXT DEFAULT 'Otros',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Índices para mejor rendimiento
    FOREIGN KEY (shopping_list_id) REFERENCES shopping_lists(id)
);

-- Índices para consultas optimizadas
CREATE INDEX IF NOT EXISTS idx_ingredients_shopping_list_id ON ingredients(shopping_list_id);
CREATE INDEX IF NOT EXISTS idx_ingredients_is_checked ON ingredients(is_checked);
CREATE INDEX IF NOT EXISTS idx_ingredients_name ON ingredients(name);
CREATE INDEX IF NOT EXISTS idx_ingredients_category ON ingredients(category);
CREATE INDEX IF NOT EXISTS idx_ingredients_shopping_list_checked ON ingredients(shopping_list_id, is_checked);
CREATE INDEX IF NOT EXISTS idx_ingredients_shopping_list_category ON ingredients(shopping_list_id, category);

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER IF NOT EXISTS update_shopping_lists_timestamp 
AFTER UPDATE ON ingredients
BEGIN
    UPDATE shopping_lists 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.shopping_list_id;
END;

CREATE TRIGGER IF NOT EXISTS update_ingredients_timestamp 
AFTER UPDATE ON ingredients
BEGIN
    UPDATE ingredients 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;
