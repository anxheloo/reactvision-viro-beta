require 'json'

package = JSON.parse(File.read(File.join(__dir__, '../package.json')))

Pod::Spec.new do |s|
  s.name                = 'ViroReact'
  s.version             = package['version']
  s.summary             = 'Viro React Native library for AR/VR applications'
  s.source              = { :git => 'https://github.com/ReactVision/viro.git', :tag => "v#{s.version}" }
  s.source_files        = 'dist/include', 'ViroReact/**/*.{h,m,mm}'
  s.public_header_files = 'dist/include/*.h', 'ViroReact/**/*.h'
  s.vendored_libraries  = 'dist/lib/libViroReact.a'
  s.homepage            = 'https://github.com/ReactVision/viro'
  s.license             = { :type => 'MIT', :file => '../LICENSE' }
  s.author              = 'ReactVision'
  s.requires_arc        = true
  s.platform            = :ios, '12.0'
  
  # React Native dependencies
  s.dependency 'React-Core'
  
  # Specify the minimum iOS version
  s.ios.deployment_target = '12.0'
  
  # Note: The Fabric interop layer should be included separately in your Podfile:
  # pod 'ViroFabric', :path => '../node_modules/@reactvision/react-viro/fabric-interop/ios'
end
