
const modelViewer1 = document.querySelector('#model');
function handleHotspotClick(f) {
  // this.data-position
  // Trigger your desired event or functionality here
  console.log('Hotspot clicked!', f);
  
}

function handleGrabHotspotsClick() {
  // Trigger your desired event or functionality here
  console.log('Hotspot clicked!');
  const buttons = document.querySelectorAll('.Hotspot');

  const hotspots = Array.from(buttons).map(button => {
      const position = button.getAttribute('data-position');
      const normal = button.getAttribute('data-normal');
      const text = button.querySelector('.HotspotAnnotation').textContent;

      return {
          'data-position': position,
          'data-normal': normal,
          'text': text
      };
  });

  const json = JSON.stringify(hotspots);
  console.log(json);
}
async function changeTexture() {
  const imageUrl = "../static/3d/color.jpg"; // Replace with the actual path to your image
  
  const texture = await modelViewer1.createTexture(imageUrl);
  // modelViewer1.model.materials[0].normalTexture.setTexture(texture);
  modelViewer1.model.materials[0].pbrMetallicRoughness.baseColorTexture.setTexture(texture);
}
modelViewer1.addEventListener('load', () => {
  changeTexture()
  
  
});