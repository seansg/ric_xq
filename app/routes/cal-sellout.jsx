import { ClientOnly } from "remix-utils";

import CalSellout from '~/components/CalSellout/index.client'

import { PrismaClient } from '@prisma/client';
 
const prisma = new PrismaClient();
 
export const prismaExample = async () => {
//  const newUser = await prisma.TransactionsType.create({
//    data: {
//      name: '買',
//    },
//  });
 
  const users = await prisma.TransactionsType.findMany();
  console.log(users)
  return null
}

export const loader = async () => {
  await prismaExample()
}

const CalSelloutRoute = () => {
  return (
    <>
      <ClientOnly fallback={<div>Loading...</div>}>
        {() => <CalSellout />}
      </ClientOnly>
    </>
  )
}

export default CalSelloutRoute
