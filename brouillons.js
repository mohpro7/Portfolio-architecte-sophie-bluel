
async function fetchcategories () {
    try {
        const response = await fetch ("http://localhost:5678/api/categories");
        const categories = await response.json();

        return categories;
    } catch (error) {
        console.error('error fetching categories')
    }  
}

