import mockNav from './mockNav'
import mockStats from './mockStats'

export const login = _login
export const getNav = _getNav
export const getStats = _getStats

function _login (username, password, company) {
  return new Promise((resolve, reject) => {
    if (__DEV__) {
      resolve('DevToken')
      return
    }
    const xmlhttp = new global.XMLHttpRequest()
    xmlhttp.open('POST', 'http://www.per4ma.org/p4lc/p4lc.asmx', true)

      // build SOAP request
    const sr = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <MobileLogin xmlns="http://www.per4ma.org/">
      <Username>${username}</Username>
      <Password>${password}</Password>
      <DatabaseName>${company}</DatabaseName>
    </MobileLogin>
  </soap:Body>
</soap:Envelope>`

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
          resolve(_formatSuccess(xmlhttp._response))
        } else {
          reject(xmlhttp._response)
        }
      }
    }
    xmlhttp.setRequestHeader('Content-Type', 'text/xml')
    xmlhttp.send(sr)
  })
}

function _getNav (token) {
  return new Promise((resolve, reject) => {
    if (__DEV__) {
      resolve(mockNav)
      return
    }
    const xmlhttp = new global.XMLHttpRequest()
    xmlhttp.open('POST', 'http://www.per4ma.org/p4lc/p4lc.asmx', true)

      // build SOAP request
    const sr = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <MobileStructure xmlns="http://www.per4ma.org/">
        <Token>${token}</Token>
      </MobileStructure>
    </soap:Body>
  </soap:Envelope>`

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
          try {
            resolve(JSON.parse(
              _formatSuccess(xmlhttp._response)
            ))
          } catch (err) {
            reject('soap getNav err: ' + err)
          }
        } else {
          reject(xmlhttp._response)
        }
      }
    }
    xmlhttp.setRequestHeader('Content-Type', 'text/xml')
    xmlhttp.send(sr)
  })
}

function _getStats (token, companyLevel, levelParameter, date) {
  return new Promise((resolve, reject) => {
    if (__DEV__) {
      resolve(mockStats())
      return
    }
    const xmlhttp = new global.XMLHttpRequest()
    xmlhttp.open('POST', 'http://www.per4ma.org/p4lc/p4lc.asmx', true)

      // build SOAP request
    const sr = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <MobileIndices xmlns="http://www.per4ma.org/">
      <Token>${token}</Token>
      <CompanyLevel>${companyLevel}</CompanyLevel>
      <LevelParameter>${levelParameter}</LevelParameter>
      <DateParam>${date}</DateParam>
    </MobileIndices>
  </soap:Body>
</soap:Envelope>`

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
          try {
            resolve(JSON.parse(
              _formatSuccess(xmlhttp._response)
            ))
          } catch (err) {
            reject('soap getStats err: ' + err)
          }
        } else {
          reject(xmlhttp._response)
        }
      }
    }
    xmlhttp.setRequestHeader('Content-Type', 'text/xml')
    xmlhttp.send(sr)
  })
}

function _formatSuccess (response) {
  return response.split('Result>')[1].split('</')[0]
}
