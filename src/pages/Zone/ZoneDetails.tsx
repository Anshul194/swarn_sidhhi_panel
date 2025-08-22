import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchZonesDetails } from '../../store/slices/Zone'
import { RootState } from '../../store'

const ZoneDetails = () => {
  const { zoneId } = useParams<{ zoneId: string }>()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, details, items } = useSelector((state: RootState) => state.zone)

  useEffect(() => {
    if (zoneId) {
      dispatch(fetchZonesDetails({ letter: zoneId }))
    }
  }, [zoneId, dispatch])

  return (
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-8 py-8 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 mx-auto">
      
      {/* Back Button */}
      <button
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center">Zone {zoneId?.toUpperCase()}</h2>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* Details Section */}
      {details && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Details</h3>
          <div className="grid grid-cols-2 gap-6 mr-10 ">
            {/* Colors */}
            <div className="flex items-center space-x-2">
              <label className="font-medium w-20">Colors:</label>
              <div className="flex-1 border rounded p-2 text-gray-700">
                {details.color_en}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 border rounded p-2 text-gray-700">
                {details.color_hi}
              </div>
            </div>
      
            {/* Shapes */}
            <div className="flex items-center space-x-2">
              <label className="font-medium w-20">Shapes:</label>
              <div className="flex-1 border rounded p-2 text-gray-700">
                {details.shape_en}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 border rounded p-2 text-gray-700">
                {details.shape_hi}
              </div>
            </div>
      
            {/* Elements */}
            <div className="flex items-center space-x-2">
              <label className="font-medium w-20">Elements:</label>
              <div className="flex-1 border rounded p-2 text-gray-700">
                {details.element_en}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 border rounded p-2 text-gray-700">
                {details.element_hi}
              </div>
            </div>
          </div>
        </div>
      )}




      {/* Items Section */}
      {items && items.length > 0 && (
        <div className="space-y-6">
          <h5 className="text-xl font-semibold mb-4">Vastu Items in House/Office</h5>
          {items.map((item, idx) => (
            <div key={idx} className=" rounded p-4 bg-white">
              {/* <h4 className="text-lg font-bold mb-2">{item.name.replace(/_/g, ' ')}</h4> */}
              <h5 className="text-s font-bold mb-2 capitalize">{item.name.replace(/_/g, ' ')}</h5>

              

              <div className="grid grid-cols-2 gap-4">
                {item.meaning_en && (
                  <div className="border p-5 rounded text-gray-700 text-sm whitespace-pre-line capitalize">
                    <strong>{item.name} in {zoneId?.toUpperCase()} Meaning (English)</strong>
                    <p dangerouslySetInnerHTML={{ __html: item.meaning_en }} />
                  </div>
                )}
                {item.meaning_hi && (
                  <div className="border p-5 rounded text-gray-700 text-sm whitespace-pre-line capitalize">
                    <strong>{item.name} in {zoneId?.toUpperCase()} Meaning (Hindi)</strong>
                    <p dangerouslySetInnerHTML={{ __html: item.meaning_hi }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ZoneDetails
