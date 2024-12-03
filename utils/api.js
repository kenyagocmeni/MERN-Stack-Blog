const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchPost = async() =>{
    try {
        const response = await fetch(`${BASE_URL}/api/blogposts`);
        if(!response.ok){
            throw new Error(`Error:${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch posts failed:", error.message);
        throw error;//Frontendde bu hatayı yönetebilmek için yukarıya fırlatıyoruz.
    }
};

export const fetchPostById = async (id) => {
    const response = await fetch(`${BASE_URL}/api/blogposts/${id}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json(); // Blog post verisi döner
  };