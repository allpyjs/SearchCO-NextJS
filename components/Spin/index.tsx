import React, { useContext } from 'react'
import { ColorRing, Oval } from 'react-loader-spinner'
import DashboardLayout from '../DashboardLayout'
import HomeContext from '@/contexts/homeContext';

const SpinPage = () => {

    return (
        <div className='w-full flex h-screen justify-center items-center' >
            <Oval
                visible={true}
                height="100"
                width="100"
                color="#4A6CF7"
                secondaryColor='#3C56C0'
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    )
}

export default SpinPage
