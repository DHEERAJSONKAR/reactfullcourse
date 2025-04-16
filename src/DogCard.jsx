import Image from "./Image";
import Name  from "./Name";

 function DogCard(props){
    let title = "this is a animal card";
    return(
        <>
        <h1 style={{fontSize:'10px', color: "red"}}>
            {title}
        </h1>
        <div>
            <Name>
            <h3>{props.name}</h3>
            </Name>
            <Image src={props.image}/>
            
        </div>
        </>
    )
}

export default DogCard;