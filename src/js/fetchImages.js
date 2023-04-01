import axios from 'axios';

export default async function fetchImages(name,page){
    const key = 'key=7874354-517214212a7de5151c1e37373'
    const url = `https://pixabay.com/api/?${key}&q=${name}&page=${page}&per_page=40&image_type=photo&pretty=true&safesearch=true&orientation=horizontal`;
    const getData = await axios.get(url);
    return await getData.data;
}



