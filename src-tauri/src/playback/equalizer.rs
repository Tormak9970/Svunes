use rustfft::FftPlanner;
use rustfft::num_complex::Complex;

use crate::playback::types::Equalizer;

// Function to apply a Hann window to a buffer of samples
// fn hann_window(buffer: &mut [f32]) {
//   let n = buffer.len();
  
//   for i in 0..n {
//     buffer[i] *= 0.5 * (1.0 - (2.0 * PI * i as f32 / (n as f32 - 1.0)).cos());
//   }
// }

fn apply_fft(buffer: &[f32]) -> Vec<Complex<f32>> {
  let n = buffer.len();
  let mut planner = FftPlanner::<f32>::new();
  let fft = planner.plan_fft_forward(n);

  let mut input: Vec<Complex<f32>> = buffer.iter().map(|&x| Complex::new(x, 0.0)).collect();
  fft.process(&mut input);

  return input;
}

fn apply_equalizer(gains: &Equalizer, fft_data: &mut [Complex<f32>], sample_rate: f32) {
  let frequency_bands = vec![
    (32.0, gains.band32), 
    (64.0, gains.band64), 
    (125.0, gains.band125), 
    (250.0, gains.band250), 
    (500.0, gains.band500), 
    (1000.0, gains.band1000), 
    (2000.0, gains.band2000), 
    (4000.0, gains.band4000), 
    (8000.0, gains.band8000), 
    (16000.0, gains.band16000),
  ];
  
  let band_width = sample_rate / fft_data.len() as f32;

  for (freq, gain) in frequency_bands {
    let bin = (freq / band_width) as usize;

    if bin < fft_data.len() {
      let phase = fft_data[bin].arg();
      let magnitude = fft_data[bin].norm();

      let adjusted_magnitude = magnitude * 10f32.powf(gain as f32 / 20.0);

      // Preserve phase and adjust magnitude
      fft_data[bin] = Complex::new(
        adjusted_magnitude * phase.cos(),
        adjusted_magnitude * phase.sin()
      );
    }
  }
}

fn apply_inverse_fft(fft_data: &mut [Complex<f32>]) -> Vec<f32> {
  let n = fft_data.len();
  let mut planner = FftPlanner::<f32>::new();
  let fft = planner.plan_fft_inverse(n);

  fft.process(fft_data);

  // * We divide by the number of bins (n) here to normalize the result, otherwise we'll get garbled audio.
  return fft_data.iter().map(|c| c.re / (n as f32)).collect();
}

/// Adjusts audio packets based on the volume, balance, and eq
pub fn equalize_audio(buffer: &[f32], sample_rate: u32, eq: Equalizer) -> Vec<f32> {
  let mut fft_data = apply_fft(&buffer);

  apply_equalizer(&eq, &mut fft_data, sample_rate as f32);

  let modified_audio = apply_inverse_fft(&mut fft_data);

  return modified_audio;
}