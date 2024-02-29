import { useContext, useEffect, useState } from "react";
import { SaviorContext } from "../contexts/SaviorContext";
import { fetchData, isObjectEmpty } from "../utils";


export const useEcosystemData = (endpoint) => {
  const server = "http://localhost:8000"
  const { savior } = useContext(SaviorContext)
  const [ data, setData ] = useState({})
  const [ userLikes, setUserLikes ] = useState([])
  
  const _getData = () => {
      let getData;
      if (!isObjectEmpty(savior)) {
        getData = async () => {
          const res = await Promise.all([
            fetch(`${server}/${endpoint}`).then(res => res.json()),
            fetchData(`stars`)
          ])
          setData(res[0].content)
          setUserLikes(res[1].content)
        }
      } else {
        getData = async () => {
          let res = await fetch(`${server}/${endpoint}`)
          res = await res.json()
          setData(res.content)
        }
      }
    getData();
  }
  useEffect(() => {
    if (isObjectEmpty(data) && !userLikes.length) {
      _getData();
    }
  }, [])

  return [ [ data, userLikes ], _getData ]
}