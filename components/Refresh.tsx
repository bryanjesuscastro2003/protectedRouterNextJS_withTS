import { NextApiRequest } from 'next'
import React from 'react'
import { IUser } from '../interfaces'

type Props = {
    user? : string | null
}

const Refresh = ({user} : Props) => {
  return user !== null ? JSON.parse(user) : null
}

export async function getServerSideProps(context : NextApiRequest) {
    const cookie = context.cookies.protectedNext
    return {
      props: {user : cookie},
    }
  }

export default Refresh