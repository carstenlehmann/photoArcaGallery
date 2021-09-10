import React from 'react'
import { NavLink } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { authToken } from '../../helpers/authentication'
import { useTranslation } from 'react-i18next'
import { useIsAdmin } from '../../components/routes/AuthorizedRoute'
import { mapboxEnabledQuery } from '../../__generated__/mapboxEnabledQuery'

export const MAPBOX_QUERY = gql`
  query mapboxEnabledQuery {
    mapboxToken
  }
`

export const FACE_DETECTION_ENABLED_QUERY = gql`
  query faceDetectionEnabled {
    siteInfo {
      faceDetectionEnabled
    }
  }
`

type MenuButtonProps = {
  to: string
  exact: boolean
  label: string
  background: string
  activeClasses?: string
  className?: string
  icon?: React.ReactChild
}

const MenuButton = ({
  to,
  exact,
  label,
  background,
  icon,
  activeClasses,
  className,
}: MenuButtonProps) => {
  return (
    <NavLink
      to={to}
      exact={exact}
      className={`rounded-lg my-2 ${className}`}
      activeClassName={`ring-4 lg:ring-4 ${activeClasses}`}
    >
      <li className="flex items-center">
        <div
          className={`w-12 h-12 p-1.5 lg:w-8 lg:h-8 lg:p-1 w-full h-full rounded-lg`}
          style={{ backgroundColor: background }}
        >
          {icon}
        </div>
        <span className="hidden lg:block ml-2">{label}</span>
      </li>
    </NavLink>
  )
}

const MenuSeparator = () => (
  <hr className="hidden lg:block my-3 border-gray-200" />
)

export const MainMenu = () => {
  const { t } = useTranslation()
  const isAdmin = useIsAdmin()

  const mapboxQuery = authToken()
    ? useQuery<mapboxEnabledQuery>(MAPBOX_QUERY)
    : null
  const faceDetectionEnabledQuery = authToken()
    ? useQuery(FACE_DETECTION_ENABLED_QUERY)
    : null

  const mapboxEnabled = !!mapboxQuery?.data?.mapboxToken
  const faceDetectionEnabled =
    !!faceDetectionEnabledQuery?.data?.siteInfo?.faceDetectionEnabled

  return (
    <div className="fixed w-full bottom-0 lg:bottom-auto lg:top-[84px] z-30 bg-white shadow-separator lg:shadow-none lg:w-[240px] lg:ml-8 lg:mr-5 flex-shrink-0">
      <ul className="flex justify-around py-2 px-2 max-w-lg mx-auto lg:flex-col lg:p-0">
        {/*<MenuButton*/}
        {/*  to="/photos"*/}
        {/*  exact*/}
        {/*  label={t('sidemenu.photos', 'Timeline')}*/}
        {/*  background="#8ac5f4"*/}
        {/*  activeClasses="ring-[#f1f8ff] bg-[#f1f8ff]"*/}
        {/*  className="outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"*/}
        {/*  icon={*/}
        {/*    <svg viewBox="0 0 24 24" fill="white">*/}
        {/*      <path d="M5.62503136,14 L9.60031266,17.978 L5.38724257,24 L2.99995461,24 C1.45289603,24 0.179346174,22.8289699 0.0173498575,21.3249546 L5.62503136,14 Z M15.7557572,10 L24.0173027,21.526562 C23.7684095,22.9323278 22.5405695,24 21.0633614,24 L21.0633614,24 L5.88324257,24 L15.7557572,10 Z"></path>*/}
        {/*    </svg>*/}
        {/*  }*/}
        {/*/>*/}
        <MenuButton
          to="/albums"
          exact
          label={t('sidemenu.albums', 'Albums')}
          background="#ff797b"
          activeClasses="ring-[#fff1f2] bg-[#fff1f2]"
          className="outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2"
          icon={
            <svg viewBox="0 0 24 24" fill="white">
              <path d="M19,2 C19.5522847,2 20,2.44771525 20,3 L20,21 C20,21.5522847 19.5522847,22 19,22 L6,22 C4.8954305,22 4,21.1045695 4,20 L4,4 C4,2.8954305 4.8954305,2 6,2 L19,2 Z M14.1465649,9 L10.9177928,13.7443828 L8.72759325,11.2494916 L6,15 L18,15 L14.1465649,9 Z M11,9 C10.4477153,9 10,9.44771525 10,10 C10,10.5522847 10.4477153,11 11,11 C11.5522847,11 12,10.5522847 12,10 C12,9.44771525 11.5522847,9 11,9 Z"></path>
            </svg>
          }
        />
        {mapboxEnabled ? (
          <MenuButton
            to="/places"
            exact
            label={t('sidemenu.places', 'Places')}
            background="#92e072"
            activeClasses="ring-[#e3fee5] bg-[#e3fee5]"
            className="outline-none focus:ring-2 focus:ring-green-100 focus:ring-offset-2"
            icon={
              <svg viewBox="0 0 24 24" fill="white">
                <path d="M2.4,3.34740684 C2.47896999,3.34740684 2.55617307,3.37078205 2.62188008,3.41458672 L8,7 L8,21 L2.4452998,17.2968665 C2.16710114,17.1114008 2,16.7991694 2,16.4648162 L2,3.74740684 C2,3.52649294 2.1790861,3.34740684 2.4,3.34740684 Z M14.5,3 L14.5,17 L8.5,21 L8.5,7 L14.5,3 Z M15,3 L21.4961389,6.71207939 C21.8077139,6.89012225 22,7.22146569 22,7.58032254 L22,20.3107281 C22,20.531642 21.8209139,20.7107281 21.6,20.7107281 C21.5303892,20.7107281 21.4619835,20.692562 21.4015444,20.6580254 L15,17 L15,3 Z"></path>
              </svg>
            }
          />
        ) : null}
        {faceDetectionEnabled ? (
          <MenuButton
            to="/people"
            exact
            label={t('sidemenu.people', 'People')}
            background="#fbcd78"
            activeClasses="ring-[#fff7e4] bg-[#fff7e4]"
            className="outline-none focus:ring-2 focus:ring-yellow-100 focus:ring-offset-2"
            icon={
              <svg viewBox="0 0 24 24" fill="white">
                <path d="M15.713873,14.2127622 C17.4283917,14.8986066 18.9087267,16.0457918 20.0014344,17.5008819 C20,19.1568542 18.6568542,20.5 17,20.5 L7,20.5 C5.34314575,20.5 4,19.1568542 4,17.5 L4.09169034,17.3788798 C5.17486154,15.981491 6.62020934,14.878942 8.28693513,14.2120314 C9.30685583,15.018595 10.5972088,15.5 12,15.5 C13.3092718,15.5 14.5205974,15.0806428 15.5069849,14.3689203 L15.713873,14.2127622 L15.713873,14.2127622 Z M12,4 C15.0375661,4 17.5,6.46243388 17.5,9.5 C17.5,12.5375661 15.0375661,15 12,15 C8.96243388,15 6.5,12.5375661 6.5,9.5 C6.5,6.46243388 8.96243388,4 12,4 Z"></path>
              </svg>
            }
          />
        ) : null}
        <MenuSeparator />
        {isAdmin && (
          <MenuButton
            to="/settings"
            exact
            label={t('sidemenu.settings', 'Settings')}
            background="#aacbd0"
            activeClasses="ring-[#e4f0f8] bg-[#e4f0f8]"
            className="outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
            icon={<svg viewBox="0 0 24 24" fill="white"></svg>}
          />
        )}
        <MenuButton
          to="/logout"
          exact
          label={t('settings.logout', 'Logout')}
          background="#aacbd0"
          activeClasses="ring-[#e4f0f8] bg-[#e4f0f8]"
          className="outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
          icon={
            <svg viewBox="0 0 24 24" fill="white">
              <path
                d="M18.271,9.212H3.615l4.184-4.184c0.306-0.306,0.306-0.801,0-1.107c-0.306-0.306-0.801-0.306-1.107,0
	L1.21,9.403C1.194,9.417,1.174,9.421,1.158,9.437c-0.181,0.181-0.242,0.425-0.209,0.66c0.005,0.038,0.012,0.071,0.022,0.109
	c0.028,0.098,0.075,0.188,0.142,0.271c0.021,0.026,0.021,0.061,0.045,0.085c0.015,0.016,0.034,0.02,0.05,0.033l5.484,5.483
	c0.306,0.307,0.801,0.307,1.107,0c0.306-0.305,0.306-0.801,0-1.105l-4.184-4.185h14.656c0.436,0,0.788-0.353,0.788-0.788
	S18.707,9.212,18.271,9.212z"
              ></path>
            </svg>
          }
        />
      </ul>
    </div>
  )
}

export default MainMenu
