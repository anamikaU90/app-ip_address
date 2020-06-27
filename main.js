/*
  Import the ip-cidr npm package.
  See https://www.npmjs.com/package/ip-cidr
  The ip-cidr package exports a class.
  Assign the class definition to variable IPCIDR.
*/
const path = require('path');
const IPCIDR = require('ip-cidr');
const { getIpv4MappedIpv6Address } = require(path.join(__dirname, 'ipv6.js'));







class IpAddress {
  constructor() {
    // IAP's global log object is used to output errors, warnings, and other
    // information to the console, IAP's log files, or a Syslog server.
    // For more information, consult the Log Class guide on the Itential
    // Developer Hub https://developer.itential.io/ located
    // under Documentation -> Developer Guides -> Log Class Guide
    log.info('Starting the IpAddress product.');
  }

  /**
 * Calculate and return the first host IP address from a CIDR subnet.
 * @param {string} cidrStr - The IPv4 subnet expressed
 *                 in CIDR format.
 * @param {callback} callback - A callback function.
 * @return {string} (firstIpAddress) - An IPv4 address.
 */
 getFirstIpAddress(cidrStr, callback) {

  // Initialize return arguments for callback
  let firstIpAddress = null;
  let callbackError = null;

  // Instantiate an object from the imported class and assign the instance to variable cidr.
  const cidr = new IPCIDR(cidrStr);
  // Initialize options for the toArray() method.
  // We want an offset of one and a limit of one.
  // This returns an array with a single element, the first host address from the subnet.
  const options = {
    from: 1,
    limit: 1
  };

  // Use the object's isValid() method to verify the passed CIDR.
  if (!cidr.isValid()) {
    // If the passed CIDR is invalid, set an error message.
    callbackError = 'Error: Invalid CIDR passed to getFirstIpAddress.';
  } else {
    // If the passed CIDR is valid, call the object's toArray() method.
    // Notice the destructering assignment syntax to get the value of the first array's element.
    let mappedAddress = getIpv4MappedIpv6Address(cidr.toString());
    if( mappedAddress ) {
      callbackError =`  IPv4 ${cidr.toArray(options)} mapped to IPv6 Address: ${mappedAddress}`;
    } else {
      console.error(`  Problem converting IPv4 ${cidr.toArray(options)} into a mapped IPv6 address.`);
      return callback({'IPV4':cidr.toArray(options).toString(),'IPV6':mappedAddress}, callbackError);
    }
    // [firstIpAddress,secondIpAddress] = [cidr.toArray(options),getIpv4MappedIpv6Address(cidr.toString())];
  }
  // Call the passed callback function.
  // Node.js convention is to pass error data as the first argument to a callback.
  // The IAP convention is to pass returned data as the first argument and error
  // data as the second argument to the callback function.
  
  //return callback({'IPV4':firstIpAddress.toString(),'IPV6':.toString()}, callbackError);
}

}
module.exports = new IpAddress;