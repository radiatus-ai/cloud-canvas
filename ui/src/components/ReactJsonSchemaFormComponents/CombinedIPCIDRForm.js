import { Alert, AlertTitle } from '@mui/material'; // Updated import
import Button from '@mui/material/Button'; // Updated import
import Card from '@mui/material/Card'; // Updated import
import CardContent from '@mui/material/CardContent'; // Updated import
import CardHeader from '@mui/material/CardHeader'; // Updated import
import Checkbox from '@mui/material/Checkbox'; // Updated import
import FormControlLabel from '@mui/material/FormControlLabel'; // Updated import
import Slider from '@mui/material/Slider'; // Updated import
import Tooltip from '@mui/material/Tooltip'; // Updated import
import Typography from '@mui/material/Typography'; // Updated import
import { CheckCircle2, Copy, Info } from 'lucide-react';
import React, { useState } from 'react';

const CombinedIPCIDRForm = ({ minCIDR = 16, maxCIDR = 28 }) => {
  const [isAuto, setIsAuto] = useState(true);
  const [ipAddress, setIpAddress] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [cidr, setCIDR] = useState(minCIDR);

  const handleAutoChange = (checked) => {
    setIsAuto(checked);
    if (checked) {
      setIpAddress('');
      setError('');
    }
  };

  const formatIPAddress = (value) => {
    const octets = value.split('.').slice(0, 4);
    return octets
      .map((octet) => {
        const num = parseInt(octet, 10);
        if (isNaN(num)) return '';
        return Math.min(255, Math.max(0, num)).toString();
      })
      .join('.');
  };

  const handleIPChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatIPAddress(value);
    setIpAddress(formattedValue);
    setError('');
  };

  const handleIPBlur = () => {
    const octets = ipAddress.split('.');
    if (octets.length !== 4 || octets.some((octet) => octet === '')) {
      setError('Please enter a valid IP address');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ipAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const cidrMap = Array.from({ length: maxCIDR - minCIDR + 1 }, (_, i) => ({
    value: minCIDR + i,
    ips: Math.pow(2, 32 - (minCIDR + i)),
  }));

  const formatIPCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getColor = (value) => {
    const hue = ((value - minCIDR) / (maxCIDR - minCIDR)) * 120;
    return `hsl(${hue}, 100%, 40%)`;
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <Typography variant="h5" align="center">
          {' '}
          {/* Updated Typography */}
          IP and CIDR Range Selector
        </Typography>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormControlLabel // Updated Checkbox
          control={
            <Checkbox
              id="auto"
              checked={isAuto}
              onChange={(e) => handleAutoChange(e.target.checked)}
            />
          }
          label="Auto"
        />

        {!isAuto && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={ipAddress}
                onChange={handleIPChange}
                onBlur={handleIPBlur}
                placeholder="000.000.000.000"
                className="w-full px-3 py-2 pr-20 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                style={{ fontFamily: 'monospace' }}
              />
              <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                {' '}
                {/* Updated Tooltip */}
                <Button
                  variant="outlined"
                  size="small"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </Tooltip>
            </div>
            {error && (
              <Alert severity="error">
                {' '}
                {/* Updated Alert */}
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <Info className="h-4 w-4 mr-1" />
              <span>Enter a valid IPv4 address (e.g., 192.168.0.1)</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Slider
            value={[cidr]}
            min={minCIDR}
            max={maxCIDR}
            step={1}
            onChange={(e, value) => setCIDR(value)} // Updated onChange
            className="w-full"
          />
          <div className="flex justify-between text-sm overflow-x-auto pb-4">
            {cidrMap.map(({ value, ips }) => (
              <div
                key={value}
                className={`flex flex-col items-center transition-all duration-300 ${
                  value === cidr ? 'scale-110' : 'scale-100'
                }`}
              >
                <div
                  className={`h-4 w-0.5 ${
                    value === cidr ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                ></div>
                <div
                  className={`mt-1 font-semibold ${
                    value === cidr ? 'text-blue-500' : 'text-gray-600'
                  }`}
                >
                  {value}
                </div>
                <div
                  className={`text-xs ${
                    value === cidr ? 'text-blue-400' : 'text-gray-400'
                  }`}
                >
                  {formatIPCount(ips)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span
              className="text-3xl font-bold"
              style={{ color: getColor(cidr) }}
            >
              /{cidr}
            </span>
            <p className="text-lg mt-2">
              {formatIPCount(Math.pow(2, 32 - cidr))} IP Addresses
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CombinedIPCIDRForm;