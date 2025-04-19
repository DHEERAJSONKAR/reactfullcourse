import {FaRegCircle, FaTimes, FaPen} from 'react-icons/fa';

function Icon({name}){
   if(name == "Circle"){
    return<FaRegCircle />
   }else if(name == "Cross"){
    return<FaTimes/>
   }else{
    return<FaPen/>
   }
}
export default Icon;