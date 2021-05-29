import Login from './Login';
import {useRouter} from 'next/router';


const loginWithRouter = (props) => {

    const router = useRouter();

    return <Login router={router}/>
};

export default loginWithRouter;