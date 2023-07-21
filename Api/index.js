const url = "http://www.omdbapi.com/?i=tt3896198&apikey=7f7eae31";

export const fetchMovies = async (title) => {
    try {
      const res = await fetch(`${url}&s=${title}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error.response);
    }
  };

export const fetchMovie = async title => {
  try {
    const res = await fetch(`${url}&t=${title}`);
    const data = res.json();
    return data;
  }
  catch (error) {
    console.error(error.response);
  }
}