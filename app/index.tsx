import { Redirect } from "expo-router";

export default function Index() {
  
  return <Redirect href="/(auth)/login" />; 
  //return <Redirect href={"/home" as any} />; 
}
