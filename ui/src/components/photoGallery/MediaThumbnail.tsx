import React from 'react'
import styled from 'styled-components'
import { ProtectedImage } from './ProtectedMedia'
import { MediaType } from '../../__generated__/globalTypes'
import { ReactComponent as VideoThumbnailIconSVG } from './icons/videoThumbnailIcon.svg'

const MediaContainer = styled.div`
  flex-grow: 1;
  flex-basis: 0;
  height: 200px;
  margin: 4px;
  background-color: #eee;
  position: relative;
  overflow: hidden;
`

const StyledPhoto = styled(ProtectedImage)`
  height: 200px;
  min-width: 100%;
  position: relative;
  object-fit: cover;

  transition: opacity 300ms;
`

type LazyPhotoProps = {
  src?: string
}

const LazyPhoto = (photoProps: LazyPhotoProps) => {
  return <StyledPhoto {...photoProps} lazyLoading />
}

const PhotoOverlay = styled.div<{ active: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: 'Hallo!';

  ${({ active }) =>
    active &&
    `
      outline: 4px solid rgba(65, 131, 196, 0.6);
      outline-offset: -4px;
    `}
`

const HoverIcon = styled.button`
  //font-size: 1.5em;
  margin: 160px 0px 0px 133px;
  color: black;
  background: white;
  //text-shadow: 0 0 4px black;
  opacity: 0;
  position: relative;
  padding-inline: 10px;

  border-radius: 12px;
  //width: 34px;
  //height: 34px;

  ${MediaContainer}:hover & {
    opacity: 1 !important;
  }

  &:hover {
    background-image: linear-gradient(to right, #94d6ec, #1cb274);
    color: white;
  }

  transition: opacity 100ms, background-color 100ms;
`

type FavoriteIconProps = {
  favorite: boolean
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
}

const FavoriteIcon = ({ favorite, onClick }: FavoriteIconProps) => {
  let isHover
  return (
    <HoverIcon
      onClick={onClick}
      style={{
        opacity: favorite ? '0.75' : undefined,
        margin: favorite ? '5px 0 0 5px' : undefined,
        fontSize: '1.3rem',
      }}
      onMouseOver={() => (isHover = true)}
      onMouseLeave={() => {
        isHover = false
      }}
    >
      {favorite ? (isHover ? 'X' : '✓') : 'Auswählen'}
    </HoverIcon>
  )
}

type SidebarIconProps = {
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
}

const SidebarIcon = ({ onClick }: SidebarIconProps) => (
  <SidebarIconWrapper onClick={onClick} style={{ paddingInline: 'none' }}>
    <svg className="m-auto" width="25px" height="25px">
      <path
        d="M19.479 10.092c-.212-3.951-3.473-7.092-7.479-7.092-4.005 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408zm-7.479 6.908l-4-4h3v-4h2v4h3l-4 4z"
        fill="black"
      />
    </svg>
  </SidebarIconWrapper>
)

const SidebarIconWrapper = styled(HoverIcon)`
  margin: 10px !important;
  position: absolute;
  top: 0;
  right: 0;

  &:hover {
    path {
      fill: white;
    }
  }
`

const VideoThumbnailIcon = styled(VideoThumbnailIconSVG)`
  color: rgba(255, 255, 255, 0.8);
  position: absolute;
  left: calc(50% - 17.5px);
  top: calc(50% - 22px);
`

type MediaThumbnailProps = {
  media: {
    id: string
    type: MediaType
    favorite?: boolean
    thumbnail: null | {
      url: string
      width: number
      height: number
    }
  }
  active: boolean
  selectImage(): void
  clickPresent(): void
  clickFavorite(): void
}

export const MediaThumbnail = ({
  media,
  active,
  selectImage,
  clickPresent,
  clickFavorite,
}: MediaThumbnailProps) => {
  let heartIcon = null
  if (media.favorite !== undefined) {
    heartIcon = (
      <FavoriteIcon
        favorite={media.favorite}
        onClick={e => {
          e.stopPropagation()
          clickFavorite()
        }}
      />
    )
  }

  let videoIcon = null
  if (media.type == MediaType.Video) {
    videoIcon = <VideoThumbnailIcon />
  }

  let minWidth = 100
  if (media.thumbnail) {
    minWidth = Math.floor(
      (media.thumbnail.width / media.thumbnail.height) * 200
    )
  }

  return (
    <MediaContainer
      key={media.id}
      style={{
        cursor: 'pointer',
        minWidth: `clamp(124px, ${minWidth}px, 100% - 8px)`,
      }}
      onClick={() => {
        clickPresent()
      }}
    >
      <div
        style={{
          // minWidth: `min(${minWidth}px, 100%)`,
          minWidth: `${minWidth}px`,
          height: `200px`,
        }}
      >
        <LazyPhoto src={media.thumbnail?.url} />
      </div>
      <PhotoOverlay active={active}>
        {videoIcon}
        <SidebarIcon
          onClick={e => {
            e.stopPropagation()
            selectImage()
          }}
        />
        {heartIcon}
      </PhotoOverlay>
    </MediaContainer>
  )
}

export const MediaPlaceholder = styled.div`
  flex-grow: 1;
  height: 200px;
  width: 300px;
  margin: 4px;
  background-color: #eee;
  position: relative;
`
