import Register from './Register';
import {useRouter} from 'next/router';


const registerWithRouter = (props) => {

    const router = useRouter();

    return <Register router={router}/>
};

export default registerWithRouter;