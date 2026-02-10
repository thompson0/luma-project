"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2Icon, XCircleIcon, InfoIcon } from "lucide-react"

const AlertContext = createContext()

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  })

  const triggerAlert = useCallback((type, title, message) => {
    setAlert({ show: true, type, title, message })
    setTimeout(() => setAlert((a) => ({ ...a, show: false })), 4000)
  }, [])

  const renderIcon = () => {
    switch (alert.type) {
      case "error":
        return <XCircleIcon className="text-red-600 mr-2" />
      case "info":
        return <InfoIcon className="text-blue-600 mr-2" />
      default:
        return <CheckCircle2Icon className="text-green-600 mr-2" />
    }
  }

  return (
    <AlertContext.Provider value={{ triggerAlert }}>
      {children}

      {alert.show && (
        <Alert
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] sm:w-auto shadow-md border text-black
    ${alert.type === "error"
              ? "bg-red-50 border-red-300"
              : alert.type === "info"
                ? "bg-blue-50 border-blue-300"
                : "bg-green-50 border-green-300"
            }`}
        >
          {renderIcon()}
          <div className="text-black">
            <AlertTitle className="text-black">{alert.title}</AlertTitle>
            <AlertDescription className="text-black">{alert.message}</AlertDescription>
          </div>
        </Alert>
      )}
    </AlertContext.Provider>
  )
}

export function useAlert() {
  return useContext(AlertContext)
}