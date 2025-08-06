"use server"

import TodoApp from "./todo/page";

export default async function Home() {
  return (
    <>
      <TodoApp />
    </>
  );
}
