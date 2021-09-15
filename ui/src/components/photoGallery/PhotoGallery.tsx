import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { MediaThumbnail, MediaPlaceholder } from './MediaThumbnail'
import PresentView from './presentView/PresentView'
import { PresentMediaProps_Media } from './presentView/PresentMedia'
import { sidebarPhoto_media_thumbnail } from '../sidebar/__generated__/sidebarPhoto'
import {
  openPresentModeAction,
  PhotoGalleryAction,
  PhotoGalleryState,
} from './photoGalleryReducer'
import {
  toggleFavoriteAction,
  useMarkFavoriteMutation,
} from './photoGalleryMutations'

const Gallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 200px;
  position: relative;
  margin: -4px;

  @media (max-width: 1000px) {
    /* Compensate for tab bar on mobile */
    margin-bottom: 76px;
  }
`

const PhotoFiller = styled.div`
  height: 200px;
  flex-grow: 999999;
`

export interface PhotoGalleryProps_Media extends PresentMediaProps_Media {
  thumbnail: sidebarPhoto_media_thumbnail | null
  favorite?: boolean
}

type PhotoGalleryProps = {
  loading: boolean
  mediaState: PhotoGalleryState
  dispatchMedia: React.Dispatch<PhotoGalleryAction>
}

const downloadFile = async (filename: string) => {
  const response = await fetch(filename, {
    credentials: 'include',
  })

  let blob = null
  blob = await response.blob()

  if (blob == null) {
    console.log('Blob is null canceling')
    return
  }
  await downloadBlob(blob, filename)
}

const downloadBlob = async (blob: Blob, filename: string) => {
  const objectUrl = window.URL.createObjectURL(blob)

  const anchor = document.createElement('a')
  document.body.appendChild(anchor)

  anchor.href = objectUrl
  anchor.download = filename
  anchor.click()

  anchor.remove()

  window.URL.revokeObjectURL(objectUrl)
}

const Button = styled.button`
  margin-block: 5px;
  margin-inline-end: 5px;
`

const PhotoGallery = ({ mediaState, dispatchMedia }: PhotoGalleryProps) => {
  const [markFavorite] = useMarkFavoriteMutation()

  const { media, activeIndex, presenting } = mediaState

  // const { updateSidebar } = useContext(SidebarContext)
  // useEffect(() => {
  //   if (mediaState.activeIndex != -1) {
  //     updateSidebar(
  //       <MediaSidebar media={mediaState.media[mediaState.activeIndex]} />
  //     )
  //   } else {
  //     updateSidebar(null)
  //   }
  // }, [activeIndex])

  let photoElements = []
  if (media) {
    photoElements = media.map((media, index) => {
      const active = activeIndex == index

      return (
        <MediaThumbnail
          key={media.id}
          media={media}
          active={active}
          selectImage={() => {
            if (media.highRes !== null) {
              downloadFile(media.highRes.url)
            }
          }}
          clickFavorite={() => {
            toggleFavoriteAction({
              media,
              markFavorite,
            })
          }}
          clickPresent={() => {
            openPresentModeAction({ dispatchMedia, activeIndex: index })
          }}
        />
      )
    })
  } else {
    for (let i = 0; i < 6; i++) {
      photoElements.push(<MediaPlaceholder key={i} />)
    }
  }

  let favCount: number
  favCount = 0

  mediaState.media.forEach((media, index) => {
    if (media.favorite) favCount++
  })

  return (
    <>
      {favCount == 0 && (
        <Button
          title="buy pictures"
          aria-label="buy pictures"
          className="rounded-md px-8 py-2 mt-2 focus:outline-none cursor-pointer bg-gradient-to-bl from-[#94d6ec] to-[#1cb274] text-white"
        >
          Alle Bilder gedruckt kaufen ({photoElements.length} Stk.)
        </Button>
      )}
      {favCount > 0 && (
        <Button
          title="buy pictures"
          aria-label="buy pictures"
          className="rounded-md px-8 py-2 mt-2 focus:outline-none cursor-pointer bg-gradient-to-bl from-[#94d6ec] to-[#1cb274] text-white"
          onClick={() => {
            let returnString = ''
            mediaState.media.forEach((media, index) => {
              if (media.favorite) {
                if (media.highRes !== null) {
                  returnString +=
                    media.highRes.url.substring(
                      media.highRes.url.indexOf('api/photo/') + 10,
                      media.highRes.url.lastIndexOf('_')
                    ) +
                    'a1' +
                    '+'
                }
              }
            })
            location.href =
              'https://photoarca.test/orderPhotos?photoList=' + returnString
          }}
        >
          Ausgewählte Bilder gedruckt kaufen ({favCount} Stk.)
        </Button>
      )}
      {favCount > 0 && (
        <Button
          title="buy pictures"
          aria-label="buy pictures"
          className="rounded-md px-8 py-2 mt-2 focus:outline-none cursor-pointer bg-gray-500 text-white"
          onClick={() => {
            mediaState.media.forEach((media, index) => {
              if (media.favorite) toggleFavoriteAction({ media, markFavorite })
            })
          }}
        >
          Alle abwählen
        </Button>
      )}
      <Gallery data-testid="photo-gallery-wrapper">
        {photoElements}
        <PhotoFiller />
      </Gallery>
      {presenting && (
        <PresentView
          activeMedia={mediaState.media[mediaState.activeIndex]}
          dispatchMedia={dispatchMedia}
        />
      )}
    </>
  )
}

export default PhotoGallery
