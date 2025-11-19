export interface Ingredient {
	id: number;
	name: string;
	quantity: string;
	unit: string;
	observations?: string;
	category?: string;
}

export interface CategorizedIngredients {
	"Frutas y Verduras": Ingredient[];
	"Proteínas": Ingredient[];
	"Lácteos y Huevos": Ingredient[];
	"Pan y Cereales": Ingredient[];
	"Despensa": Ingredient[];
	"Otros": Ingredient[];
}
