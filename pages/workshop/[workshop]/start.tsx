import React, {useContext, useEffect} from 'react';
import {Button} from '../../../frontend/components/button/Button';
import {WorkshopContext} from "../../../frontend/context/WorkshopContext";
import { useTranslation } from 'react-i18next';
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {Spinner} from "../../../frontend/components/spinner/Spinner";
import {GetServerSideProps, GetServerSidePropsContext} from "next";

type StartProps = {
    workshop: {
        start: {
            header: string,
            button: string
        }
    }
}

const Start = ( {workshop} : StartProps ) => {
    const context = useContext(WorkshopContext);
    useEffect(()=> {
        context.connect();
    }, [])
    return (
        <div className={'flex basis-auto flex-1 justify-center items-center flex-grow h-screen w-screen'}>
            <div className={'flex basis-auto flex-initial flex-col justify-center items-center bg-blue-50 p-10 rounded-3xl'}>
                <p className={'text-xl tracking-wide font-thin'}>{workshop.start.header}</p>
                <p className={'text-3xl font-bold mt-4 mb-14'}>Workshop</p>
                {
                    !context.connected && <Spinner/>
                }
                {
                    context.connected && <p>Waiting for your faciliator...</p>
                }
            </div>
        </div>
    )
}

type GetServerSidePropsContextWithLocale = GetServerSidePropsContext & {
    locale: string
    query : {
        workshop?: string
    }
}

export async function getServerSideProps(context: GetServerSidePropsContextWithLocale) {
    const query = context.query.workshop;
    const translations = (await serverSideTranslations(context.locale))._nextI18Next.initialI18nStore[context.locale].common;
    if (query !== 'id') {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }
    return {
        props: {
            ...translations,
            // Will be passed to the page component as props
        },
    };
}

export default Start;